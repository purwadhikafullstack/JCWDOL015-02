import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fungsi untuk menghitung jarak antara dua titik menggunakan rumus Haversine
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // radius bumi dalam km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // dalam km
  return distance;
}

// Fungsi untuk mencari outlet terdekat
export async function findNearestOutlet(userAddressId: number) {
  try {
    const userAddress = await prisma.address.findUnique({
      where: { id: userAddressId },
    });

    if (
      !userAddress ||
      userAddress.latitude === null ||
      userAddress.longitude === null
    ) {
      throw new Error(
        'Alamat pengguna tidak ditemukan atau koordinat tidak lengkap',
      );
    }

    // Ambil semua outlet dari database
    const outlets = await prisma.outlet.findMany({
      include: { Address: true },
    });

    let nearestOutlet: any = null;
    let shortestDistance = Infinity;

    // Hitung jarak untuk setiap outlet
    for (const outlet of outlets) {
      // Pastikan bahwa outlet memiliki satu objek Address dan bukan array
      const address = outlet.Address as unknown as {
        latitude: number | null;
        longitude: number | null;
      };

      if (!address || address.latitude === null || address.longitude === null) {
        continue;
      }

      // Gunakan parseFloat untuk memastikan nilai bukan `null` saat digunakan dalam kalkulasi
      const distance = calculateDistance(
        parseFloat(userAddress.latitude.toString()),
        parseFloat(userAddress.longitude.toString()),
        parseFloat(address.latitude.toString()),
        parseFloat(address.longitude.toString()),
      );

      // Cari outlet dengan jarak terdekat
      if (distance < shortestDistance) {
        nearestOutlet = outlet;
        shortestDistance = distance;
      }
    }

    // Mengembalikan outlet terdekat
    return {
      nearestOutlet,
      distance: shortestDistance,
    };
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        'Terjadi kesalahan dalam mencari outlet terdekat',
    );
  }
}
