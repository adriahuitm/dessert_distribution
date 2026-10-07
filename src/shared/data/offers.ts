export type Offer = {
    slug: string;
    dessert: string;
    bakery: string;
    area: string;
    distance: string;
    pickup: string;
    expires: string;
    price: string;
    originalPrice?: string;
    audience: 'Everyone' | 'Students';
    remaining: number;
    total: number;
    emoji: string;
    tone: string;
    description: string;
    address: string;
    businessActivityCode?: string;
};

// Fictional starter listings. Real offer listings are added through the local API.
export const offers: Offer[] = [
    { slug: 'butter-cloud-croissants', dessert: 'Butter cloud croissants', bakery: 'Sunday Bakehouse', area: 'TTDI, Kuala Lumpur', distance: '0.8 km', pickup: 'Today, 8:00-9:00 pm', expires: 'Pickup window today', price: 'Free', audience: 'Everyone', remaining: 4, total: 8, emoji: '\u{1F950}', tone: 'peach', description: 'Flaky, all-butter croissants baked this morning. A few are left before closing.', address: '12 Jalan Tun Mohd Fuad 2, TTDI' },
    { slug: 'strawberry-milk-cake', dessert: 'Strawberry milk cake', bakery: 'Little Cloud Patisserie', area: 'Bangsar, Kuala Lumpur', distance: '2.1 km', pickup: 'Today, 8:30-9:30 pm', expires: 'Pickup window today', price: 'RM 8', originalPrice: 'RM 16', audience: 'Students', remaining: 3, total: 6, emoji: '\u{1F370}', tone: 'pink', description: 'A soft sponge layered with fresh strawberries and whipped cream. Show your student card at pickup.', address: '28 Jalan Telawi 3, Bangsar' },
    { slug: 'cinnamon-morning-buns', dessert: 'Cinnamon morning buns', bakery: 'Flour & Fold', area: 'Damansara Heights, Kuala Lumpur', distance: '3.4 km', pickup: 'Today, 7:45-8:45 pm', expires: 'Pickup window today', price: 'RM 5', originalPrice: 'RM 12', audience: 'Everyone', remaining: 5, total: 10, emoji: '\u{1F967}', tone: 'gold', description: 'Warm, buttery buns rolled in cinnamon sugar. Best enjoyed tonight.', address: '7 Jalan Setiabistari, Damansara Heights' },
    { slug: 'matcha-cookie-box', dessert: 'Matcha cookie box', bakery: 'Mori Bake Lab', area: 'Mont Kiara, Kuala Lumpur', distance: '4.7 km', pickup: 'Today, 8:00-9:00 pm', expires: 'Pickup window today', price: 'RM 6', originalPrice: 'RM 14', audience: 'Students', remaining: 2, total: 5, emoji: '\u{1F36A}', tone: 'green', description: 'Six chewy white chocolate matcha cookies. Student offer while the last boxes last.', address: 'A-1-3, Plaza Mont Kiara' },
    { slug: 'pandan-kaya-swiss-roll', dessert: 'Pandan kaya Swiss roll', bakery: 'Kedai Roti Nona', area: 'Kampung Baru, Kuala Lumpur', distance: '5.2 km', pickup: 'Today, 8:15-9:15 pm', expires: 'Pickup window today', price: 'Free', audience: 'Everyone', remaining: 3, total: 6, emoji: '\u{1F343}', tone: 'mint', description: 'Pandan sponge with house-made kaya cream. Take home a slice before closing.', address: '19 Jalan Raja Muda Musa, Kampung Baru' },
    { slug: 'burnt-cheesecake-slice', dessert: 'Basque cheesecake slice', bakery: 'Golden Hour Cakes', area: 'Petaling Jaya', distance: '7.6 km', pickup: 'Today, 8:30-9:30 pm', expires: 'Pickup window today', price: 'RM 7', originalPrice: 'RM 15', audience: 'Everyone', remaining: 6, total: 8, emoji: '\u{1F36E}', tone: 'cream', description: 'Creamy Basque-style cheesecake with a deeply caramelised top.', address: '35 Jalan SS 2/75, Petaling Jaya' },
];
