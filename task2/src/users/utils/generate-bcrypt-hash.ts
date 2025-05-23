import * as bcrypt from 'bcryptjs';

async function generateHash() {
  const plainPassword = 'freen_01';
  const saltRounds = 10;
  const hash = await bcrypt.hash(plainPassword, saltRounds);
  console.log('Generated bcrypt hash for password:', plainPassword);
  console.log(hash);
}

generateHash().catch(console.error);
