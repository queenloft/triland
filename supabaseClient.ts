import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ifxxdjendmiofusdcmkw.supabase.co';
const supabaseKey = 'sb_publishable_AMROKBMxdpRzi79zD1NtPw_9-96KEOa';

let client;

// Robust Mock Client Builder for Fallback
const createMockClient = () => {
  const mockOp = () => ({
    select: () => mockOp(),
    order: () => mockOp(),
    limit: () => mockOp(),
    eq: () => mockOp(),
    single: () => ({ data: null, error: { message: 'Mock Fallback Data (Database not connected)' } }),
    insert: () => ({ data: null, error: { message: 'Mock Fallback' } }),
    update: () => mockOp(),
    delete: () => mockOp(),
    then: (resolve: any) => resolve({ data: null, error: { message: 'Mock Fallback' } })
  });
  
  return {
    from: () => mockOp()
  };
};

try {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials missing');
  }

  // Check for standard JWT format to avoid library crash on custom keys
  // Standard anon keys start with 'ey', but we'll try-catch the creation anyway.
  // We use the mock client if the key doesn't look "standard" just to be safe in this environment,
  // UNLESS the user explicitly wants to try connecting with this key.
  // Given the error history, we'll try to create it, but catch ANY failure.
  
  client = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  });
  
} catch (e) {
  console.warn('Supabase client initialization failed, falling back to mock client.', e);
  client = createMockClient();
}

export const supabase = client as any;