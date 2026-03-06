// End-to-end encryption for agent hub messages
import { webcrypto } from 'crypto';

export class E2EEncryption {
  private static instance: E2EEncryption;
  private keyPair: CryptoKeyPair | null = null;
  private agentKeys: Map<string, CryptoKey> = new Map();

  static getInstance(): E2EEncryption {
    if (!E2EEncryption.instance) {
      E2EEncryption.instance = new E2EEncryption();
    }
    return E2EEncryption.instance;
  }

  // Generate user's key pair for this session
  async generateUserKeyPair(): Promise<void> {
    this.keyPair = await webcrypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true, // extractable
      ['encrypt', 'decrypt']
    );
  }

  // Get user's public key for sharing
  async getUserPublicKey(): Promise<string> {
    if (!this.keyPair) {
      await this.generateUserKeyPair();
    }
    
    const publicKeyBuffer = await webcrypto.subtle.exportKey(
      'spki',
      this.keyPair!.publicKey
    );
    
    const uint8Array = new Uint8Array(publicKeyBuffer);
    return btoa(String.fromCharCode.apply(null, Array.from(uint8Array)));
  }

  // Import another user's public key
  async importPublicKey(publicKeyBase64: string): Promise<CryptoKey> {
    const binaryString = atob(publicKeyBase64);
    const publicKeyBuffer = new ArrayBuffer(binaryString.length);
    const view = new Uint8Array(publicKeyBuffer);
    for (let i = 0; i < binaryString.length; i++) {
      view[i] = binaryString.charCodeAt(i);
    }

    return await webcrypto.subtle.importKey(
      'spki',
      publicKeyBuffer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      false,
      ['encrypt']
    );
  }

  // Generate shared room key for agent hub
  async generateRoomKey(agentId: string): Promise<CryptoKey> {
    const roomKey = await webcrypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );

    this.agentKeys.set(agentId, roomKey);
    return roomKey;
  }

  // Encrypt message for agent hub
  async encryptMessage(agentId: string, message: string): Promise<{
    encryptedData: string;
    iv: string;
  }> {
    let roomKey = this.agentKeys.get(agentId);
    
    if (!roomKey) {
      roomKey = await this.generateRoomKey(agentId);
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    
    const iv = webcrypto.getRandomValues(new Uint8Array(12));
    
    const encryptedBuffer = await webcrypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      roomKey,
      data
    );

    const encryptedUint8 = new Uint8Array(encryptedBuffer);
    const ivUint8 = new Uint8Array(iv);
    
    return {
      encryptedData: btoa(String.fromCharCode.apply(null, Array.from(encryptedUint8))),
      iv: btoa(String.fromCharCode.apply(null, Array.from(ivUint8))),
    };
  }

  // Decrypt message from agent hub
  async decryptMessage(agentId: string, encryptedData: string, iv: string): Promise<string> {
    const roomKey = this.agentKeys.get(agentId);
    
    if (!roomKey) {
      throw new Error('No room key found for agent');
    }

    const encryptedBinaryString = atob(encryptedData);
    const encryptedBuffer = new ArrayBuffer(encryptedBinaryString.length);
    const encryptedView = new Uint8Array(encryptedBuffer);
    for (let i = 0; i < encryptedBinaryString.length; i++) {
      encryptedView[i] = encryptedBinaryString.charCodeAt(i);
    }
    
    const ivBinaryString = atob(iv);
    const ivBuffer = new ArrayBuffer(ivBinaryString.length);
    const ivView = new Uint8Array(ivBuffer);
    for (let i = 0; i < ivBinaryString.length; i++) {
      ivView[i] = ivBinaryString.charCodeAt(i);
    }

    const decryptedBuffer = await webcrypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: ivView,
      },
      roomKey,
      encryptedBuffer
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  }

  // Encrypt file for sharing
  async encryptFile(agentId: string, file: File): Promise<{
    encryptedFile: ArrayBuffer;
    iv: string;
    fileName: string;
    mimeType: string;
  }> {
    let roomKey = this.agentKeys.get(agentId);
    
    if (!roomKey) {
      roomKey = await this.generateRoomKey(agentId);
    }

    const fileBuffer = await file.arrayBuffer();
    const iv = webcrypto.getRandomValues(new Uint8Array(12));
    
    const encryptedBuffer = await webcrypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      roomKey,
      fileBuffer
    );

    const ivUint8 = new Uint8Array(iv);
    
    return {
      encryptedFile: encryptedBuffer,
      iv: btoa(String.fromCharCode.apply(null, Array.from(ivUint8))),
      fileName: file.name,
      mimeType: file.type,
    };
  }

  // Decrypt file
  async decryptFile(
    agentId: string, 
    encryptedFile: ArrayBuffer, 
    iv: string, 
    fileName: string, 
    mimeType: string
  ): Promise<File> {
    const roomKey = this.agentKeys.get(agentId);
    
    if (!roomKey) {
      throw new Error('No room key found for agent');
    }

    const ivBinaryString = atob(iv);
    const ivBuffer = new ArrayBuffer(ivBinaryString.length);
    const ivView = new Uint8Array(ivBuffer);
    for (let i = 0; i < ivBinaryString.length; i++) {
      ivView[i] = ivBinaryString.charCodeAt(i);
    }

    const decryptedBuffer = await webcrypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: ivView,
      },
      roomKey,
      encryptedFile
    );

    return new File([decryptedBuffer], fileName, { type: mimeType });
  }
}

// Export singleton instance
export const encryption = E2EEncryption.getInstance();