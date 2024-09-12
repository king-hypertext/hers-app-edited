export const getNearbyHealthFacilities = async (longitude, latitude) => {
    const fetchFacilities = await fetch(`https://api.geoapify.com/v2/places?categories=healthcare,healthcare.pharmacy&filter=circle:${longitude},${latitude},5000&apiKey=106c00dddf2240acadfa5fdc28cf30e1`);
    const facilities = await fetchFacilities.json()

    if (facilities) {
        return facilities.features
    } else {
        console.log('error getting facilities')
        return
    }

}