const makeBuckets = n => {
	// returns n number of buckets items
	// default is 15
	const num = n || 15;
	const buckets = [];
	for (let i = 0; i < num; i++) {
		buckets.push({
			id: `bucket-item-${i}`,
			name: `Bucket item ${i}`,
			location: {
				id: 'a0c51094-05d9-465f-8745-6cd9ee45b96d',
				name: 'Kranj',
			},
		});
	}
	return buckets;
};

export const buckets = makeBuckets(200);

export const locations = {
	locations: [
		{
			id: '541909F3-20FC-4382-A8E8-18042F5E7677',
			name: 'Kranj',
		},
		{
			id: '571E30F3-7A96-45FF-8FDE-0A3F0E6BBDF4',
			name: 'Ljubljana',
		},
	],
};
