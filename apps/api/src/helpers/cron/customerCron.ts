import prisma from '@/prisma';
import cron from 'node-cron';

// cron.schedule('*/1 * * * *', async () => {
//     const deletedUsers = await prisma.user.deleteMany({
//         where: {
//             verifyTokenExp: {
//                 lt: new Date()
//             }
//         }
//     })
// });
