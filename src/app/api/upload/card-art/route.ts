import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyApiKey, unauthorizedResponse, errorResponse, successResponse } from '@/lib/auth'

// TODO: Install sharp for server-side image processing:
//   npm i sharp @types/sharp
// Once installed, uncomment the sharp processing block below to:
//   - Center-crop to 820×676px
//   - Convert to WebP at quality 92
// Current MVP: validates file + uploads raw (no resize/convert)

export async function POST(req: NextRequest) {
  const auth = await verifyApiKey(req)
  if (!auth) return unauthorizedResponse()

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return errorResponse('Invalid multipart/form-data')
  }

  const file = formData.get('file') as File | null
  const skill_set_id = formData.get('skill_set_id') as string | null

  if (!file) return errorResponse('file is required')
  if (!skill_set_id) return errorResponse('skill_set_id is required')

  // Validate file type
  if (!file.type.startsWith('image/')) {
    return errorResponse('File must be an image (image/*)')
  }

  // Validate file size (8MB max)
  const MAX_SIZE = 8 * 1024 * 1024
  if (file.size > MAX_SIZE) {
    return errorResponse('File exceeds 8MB limit')
  }

  // Verify ownership — agent must own the skill set
  const { data: skillSet, error: ssError } = await supabaseAdmin
    .from('skill_sets')
    .select('id, creator_agent_id')
    .eq('id', skill_set_id)
    .single()

  if (ssError || !skillSet) return errorResponse('Skill set not found', 404)
  if (skillSet.creator_agent_id !== auth.agentId) {
    return errorResponse('Forbidden: you do not own this skill set', 403)
  }

  // Read file bytes
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // TODO: Uncomment when sharp is installed:
  // const sharp = (await import('sharp')).default
  // const processed = await sharp(buffer)
  //   .resize(820, 676, { fit: 'cover', position: 'centre' })
  //   .webp({ quality: 92 })
  //   .toBuffer()
  // const uploadBuffer = processed
  // const contentType = 'image/webp'
  // const uploadPath = `${auth.agentId}/${skill_set_id}/art.webp`

  // MVP: upload raw file without processing
  const uploadBuffer = buffer
  const contentType = file.type
  const ext = file.type === 'image/webp' ? 'webp'
    : file.type === 'image/png' ? 'png'
    : file.type === 'image/gif' ? 'gif'
    : 'jpg'
  const uploadPath = `${auth.agentId}/${skill_set_id}/art.${ext}`

  const { error: uploadError } = await supabaseAdmin.storage
    .from('card-art')
    .upload(uploadPath, uploadBuffer, {
      contentType,
      upsert: true,
    })

  if (uploadError) {
    return errorResponse(`Upload failed: ${uploadError.message}`, 500)
  }

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('card-art')
    .getPublicUrl(uploadPath)

  // Update collection art_image_url if a collection exists for this skill set
  await supabaseAdmin
    .from('collections')
    .update({ art_image_url: publicUrl })
    .eq('skill_set_id', skill_set_id)

  return successResponse(
    {
      art_image_url: publicUrl,
      width: 820,    // target dimensions (TODO: actual after sharp processing)
      height: 676,
      size_bytes: file.size,
    },
    201,
  )
}
