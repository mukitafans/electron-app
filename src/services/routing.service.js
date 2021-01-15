import axios from 'axios';
import TrackAlfon from '../assets/json/track_alfon.json';

//Get track in JSON
const ArrTrackAlfonReves = [];
const ArrTrackAlfon = [];
TrackAlfon.track.map(obj => {
    let lon_ = parseFloat(obj.lon);
    let lat_ = parseFloat(obj.lat);
    let lon = lon_.toPrecision(7)
    let lat = lat_.toPrecision(7)
    ArrTrackAlfonReves.push([parseFloat(lon), parseFloat(lat)]);
    ArrTrackAlfon.push([parseFloat(lat), parseFloat(lon)]);
})

export const routingService = {
    getRoute,
    getRouteParking,
    getRouteParkingTrackAlfon
};


//Get route from two points selected
function getRoute(lat1, lng1, lat2, lng2) {
    return axios.get("https://graphhopper.com/api/1/route?point=" + lat1 + "," + lng1 + "&point=" + lat2 + "," + lng2 + "&vehicle=foot&locale=de&calc_points=true&points_encoded=false&key=75fbf8a1-dfb9-4102-84fb-123f5de9855e")
        .then(res => {
            if (res.status === 200) {
                let obj = [];
                res.data.paths[0].points.coordinates.forEach(el => {
                    obj.push({ lat: el[1], lng: el[0] })
                })
                return { latLon: obj, array: res.data.paths[0].points.coordinates };
            }
        })
        .catch(() => { return { error: "Routing fail!" } });
}

//Get route in to parking
function getRouteParking(lat1, lng1, lat2, lng2) {
    let start = 10000000, end = 1000000, posStart = 0, posEnd = 0;
    polyCircuito.forEach((point, i) => {
        let distStart = distance(lat1, lng1, point[0], point[1]);
        let distEnd = distance(lat2, lng2, point[0], point[1]);

        if (distStart < start) {
            start = distStart;
            posStart = i;
        }

        if (distEnd < end) {
            end = distEnd;
            posEnd = i;
        }
    });
    if (posStart > posEnd) return polyCircuitoReves.slice(posEnd, posStart)
    return polyCircuitoReves.slice(posStart, posEnd)
}

//Get route from trak defined in ficoba
function getRouteParkingTrackAlfon(lat1, lng1, lat2, lng2) {
    let start = 10000000, end = 1000000, posStart = 0, posEnd = 0;
    ArrTrackAlfon.forEach((point, i) => {
        let distStart = distance(lat1, lng1, point[0], point[1]);
        let distEnd = distance(lat2, lng2, point[0], point[1]);

        if (distStart < start) {
            start = distStart;
            posStart = i;
        }

        if (distEnd < end) {
            end = distEnd;
            posEnd = i;
        }
    });
    if (posStart > posEnd) return ArrTrackAlfonReves.slice(posEnd, posStart)
    return ArrTrackAlfonReves.slice(posStart, posEnd)
}

const distance = (lat1, lon1, lat2, lon2) => {
    var R = 6371; // km (change this constant to get miles)
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d * 1000;
}

const polyCircuito = [
    [43.34618, -1.788946],
    [43.34619, -1.78898],
    [43.3462, -1.789007],
    [43.3462, -1.78905],
    [43.34621, -1.789082],
    [43.34621, -1.78913],
    [43.34621, -1.789176],
    [43.34621, -1.789214],
    [43.3462, -1.78925],
    [43.34619, -1.789287],
    [43.34617, -1.789319],
    [43.34615, -1.789349],
    [43.34612, -1.789361],
    [43.34609, -1.789366],
    [43.34606, -1.789356],
    [43.34603, -1.789341],
    [43.34601, -1.789321],
    [43.34599, -1.7893],
    [43.34597, -1.789275],
    [43.34596, -1.78925],
    [43.34595, -1.789227],
    [43.34594, -1.789204],
    [43.34593, -1.789175],
    [43.34592, -1.789155],
    [43.34591, -1.789131],
    [43.3459, -1.789109],
    [43.34589, -1.789074],
    [43.34589, -1.789041],
    [43.34588, -1.789006],
    [43.34588, -1.788974],
    [43.34588, -1.78894],
    [43.34588, -1.788913],
    [43.34588, -1.788881],
    [43.34589, -1.788855],
    [43.34589, -1.788817],
    [43.3459, -1.788791],
    [43.34592, -1.78876],
    [43.34594, -1.788732],
    [43.34596, -1.788717],
    [43.34598, -1.788714],
    [43.346, -1.788716],
    [43.34603, -1.788723],
    [43.34606, -1.788738],
    [43.34608, -1.788762],
    [43.3461, -1.788785],
    [43.34612, -1.788818],
    [43.34613, -1.788841],
    [43.34614, -1.788859],
    [43.34616, -1.788879],
    [43.34618, -1.788946]
];

const polyCircuitoReves = [[-1.788946, 43.34618], [-1.78898, 43.34619], [-1.789007, 43.3462], [-1.78905, 43.3462], [-1.789082, 43.34621], [-1.78913, 43.34621], [-1.789176, 43.34621], [-1.789214, 43.34621], [-1.78925, 43.3462], [-1.789287, 43.34619], [-1.789319, 43.34617], [-1.789349, 43.34615], [-1.789361, 43.34612], [-1.789366, 43.34609], [-1.789356, 43.34606], [-1.789341, 43.34603], [-1.789321, 43.34601], [-1.7893, 43.34599], [-1.789275, 43.34597], [-1.78925, 43.34596], [-1.789227, 43.34595], [-1.789204, 43.34594], [-1.789175, 43.34593], [-1.789155, 43.34592], [-1.789131, 43.34591], [-1.789109, 43.3459], [-1.789074, 43.34589], [-1.789041, 43.34589], [-1.789006, 43.34588], [-1.788974, 43.34588], [-1.78894, 43.34588], [-1.788913, 43.34588], [-1.788881, 43.34588], [-1.788855, 43.34589], [-1.788817, 43.34589], [-1.788791, 43.3459], [-1.78876, 43.34592], [-1.788732, 43.34594], [-1.788717, 43.34596], [-1.788714, 43.34598], [-1.788716, 43.346], [-1.788723, 43.34603], [-1.788738, 43.34606], [-1.788762, 43.34608], [-1.788785, 43.3461], [-1.788818, 43.34612], [-1.788841, 43.34613], [-1.788859, 43.34614], [-1.788879, 43.34616], [-1.788946, 43.34618]];
