export async function fetchAttractions() {
    try {
        const response = await fetch('./data/uganda-attractions.json');
    }

        return await response.json();
} catch (error) {
    console.error('Fetch error:', error);
    throw error;
}
}
