import * as bcrypt from 'bcryptjs';

async function testBcryptCompare() {
  const plainPassword = 'alishayan_01';
  const hashedPassword = '$2b$10$w7u4..feg4aihRZex.n97ePbOFTffmQYKzvxHwWveblCV6ERu1vd6';
  const match = await bcrypt.compare(plainPassword, hashedPassword);
  console.log('Password match result:', match);
}

testBcryptCompare().catch(console.error);
