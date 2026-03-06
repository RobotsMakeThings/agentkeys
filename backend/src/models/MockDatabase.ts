// Mock Database for development - avoiding Redis/PostgreSQL dependencies
export class Database {
    private static instance: Database;
    private mockData: any = {};

    private constructor() {
        console.log('Mock Database initialized for development');
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public async query(sql: string, params?: any[]): Promise<{ rows: any[] }> {
        // Mock query results
        console.log(`Mock Query: ${sql}`, params);
        return { rows: [] };
    }

    public getRedis() {
        return {
            ping: async () => 'PONG',
            get: async (key: string) => this.mockData[key],
            set: async (key: string, value: any) => { this.mockData[key] = value; },
            del: async (key: string) => { delete this.mockData[key]; }
        };
    }

    public async close(): Promise<void> {
        console.log('Mock Database closed');
    }
}