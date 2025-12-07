import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create categories first
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        nome: 'Eletrônicos',
      },
    }),
    prisma.category.create({
      data: {
        nome: 'Roupas',
      },
    }),
    prisma.category.create({
      data: {
        nome: 'Alimentos',
      },
    }),
    prisma.category.create({
      data: {
        nome: 'Livros',
      },
    }),
    prisma.category.create({
      data: {
        nome: 'Esportes',
      },
    }),
  ]);

  console.log('✅ Created categories');

  // Create 5 users, each with one store and 3 products
  for (let i = 1; i <= 5; i++) {
    const hashedPassword = await bcrypt.hash('senha123', 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        username: `usuario${i}`,
        nome: `Usuário ${i}`,
        email: `usuario${i}@example.com`,
        senha_hash: hashedPassword,
        foto_perfil_url: `https://i.pravatar.cc/150?img=${i}`,
      },
    });

    console.log(`✅ Created user: ${user.username}`);

    // Create store for the user
    const store = await prisma.store.create({
      data: {
        usuarioId: user.id,
        nome: `Loja ${i}`,
        descricao: `Descrição da Loja ${i} - Os melhores produtos você encontra aqui!`,
        logo_url: `https://ui-avatars.com/api/?name=Loja+${i}&background=6A38F3&color=fff&size=200`,
        banner_url: `https://source.unsplash.com/random/1920x539?store,${i}`,
        sticker_url: `https://ui-avatars.com/api/?name=L${i}&background=C6E700&color=000&size=100`,
      },
    });

    console.log(`✅ Created store: ${store.nome}`);

    // Create 3 products for each store
    for (let j = 1; j <= 3; j++) {
      const categoryIndex = (i + j - 1) % categories.length;
      const productNames = [
        ['Smartphone Galaxy', 'Notebook Premium', 'Fone Bluetooth'],
        ['Camiseta Básica', 'Calça Jeans', 'Jaqueta de Couro'],
        ['Arroz Orgânico 5kg', 'Café Especial', 'Chocolate Artesanal'],
        ['Romance Bestseller', 'Livro Técnico', 'HQ Coleção'],
        ['Bola de Futebol', 'Raquete de Tênis', 'Kit de Yoga'],
      ];

      const productDescriptions = [
        ['Smartphone de última geração com câmera de alta resolução', 'Notebook potente para trabalho e games', 'Fone com cancelamento de ruído'],
        ['Camiseta 100% algodão com design moderno', 'Calça jeans premium de alta qualidade', 'Jaqueta elegante para todas as ocasiões'],
        ['Arroz orgânico cultivado sem agrotóxicos', 'Café premium de grãos selecionados', 'Chocolate artesanal de cacau puro'],
        ['Romance emocionante de autor premiado', 'Guia completo para profissionais', 'Edição especial de colecionador'],
        ['Bola profissional de alta durabilidade', 'Raquete leve e resistente', 'Kit completo para prática de yoga'],
      ];

      const prices = [
        [299900, 459900, 35900],
        [5990, 12990, 29990],
        [2990, 4590, 1890],
        [4990, 8990, 12990],
        [8990, 25990, 15990],
      ];

      const product = await prisma.produto.create({
        data: {
          lojaId: store.id,
          categoriaId: categories[categoryIndex].id,
          nome: productNames[i - 1][j - 1],
          descricao: productDescriptions[i - 1][j - 1],
          preco: prices[i - 1][j - 1],
          estoque: Math.floor(Math.random() * 50) + 10, // Random stock between 10-59
        },
      });

      // Create product images
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: `https://source.unsplash.com/random/800x800?product,${i}${j}`,
          alt_text: `Imagem do ${product.nome}`,
        },
      });

      console.log(`  ✅ Created product: ${product.nome}`);
    }

    // Create some reviews for the store
    const otherUsers = await prisma.user.findMany({
      where: {
        id: { not: user.id },
      },
      take: 2,
    });

    for (const reviewer of otherUsers) {
      await prisma.storeReview.create({
        data: {
          usuarioId: reviewer.id,
          lojaId: store.id,
          nota: Math.floor(Math.random() * 2) + 4, // Random rating 4-5
          comentario: `Ótima loja! Produtos de qualidade e entrega rápida. Recomendo!`,
        },
      });
    }

    if (otherUsers.length > 0) {
      console.log(`  ✅ Created ${otherUsers.length} reviews for ${store.nome}`);
    }
  }

  console.log('');
  console.log('🎉 Database seeding completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`   - Users: 5`);
  console.log(`   - Stores: 5`);
  console.log(`   - Products: 15`);
  console.log(`   - Categories: 5`);
  console.log('');
  console.log('🔐 Login credentials for all users:');
  console.log('   Email: usuario1@example.com to usuario5@example.com');
  console.log('   Password: senha123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
