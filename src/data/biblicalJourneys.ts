export interface BiblicalJourneyPoint {
  name: string;
  coordinates: [number, number];
  note: string;
}

export interface BiblicalJourney {
  id: string;
  name: string;
  era: string;
  figure: string;
  description: string;
  scripture: string;
  color: string; // monochrome tone: e.g. white, light grey, dashed
  dashArray?: string;
  waypoints: BiblicalJourneyPoint[];
}

export const BIBLICAL_JOURNEYS: BiblicalJourney[] = [
  {
    id: 'abraham-journey',
    name: 'Abraham\'s Journey of Faith',
    era: 'Creation & Patriarchs',
    figure: 'Abraham',
    description: 'The monumental pilgrimage of Abraham from Ur of the Chaldeans to Haran, Canaan (Shechem, Bethel, Hebron), Egypt during famine, and back to the Promised Land.',
    scripture: 'Genesis 11:31 - 13:18',
    color: '#ffffff',
    waypoints: [
      { name: 'Ur of the Chaldees', coordinates: [30.9628, 46.1031], note: 'God calls Abraham out of his homeland' },
      { name: 'Haran', coordinates: [36.8647, 39.0272], note: 'Terah dies; Abraham departs at age 75' },
      { name: 'Shechem', coordinates: [32.2139, 35.2858], note: 'Abraham builds first altar at Oak of Moreh' },
      { name: 'Bethel', coordinates: [31.9284, 35.2415], note: 'Pitches tent and calls on the name of Yahweh' },
      { name: 'Hebron', coordinates: [31.5294, 35.0998], note: 'Oaks of Mamre; covenant confirmed' },
      { name: 'Egypt (Nile Delta)', coordinates: [30.5852, 31.5036], note: 'Sojourn during famine in Canaan' },
      { name: 'Hebron', coordinates: [31.5294, 35.0998], note: 'Returns with great wealth; purchases Machpelah' },
    ],
  },
  {
    id: 'exodus-journey',
    name: 'The Exodus & Wilderness Wandering',
    era: 'Exodus & Judges',
    figure: 'Moses & Israel',
    description: 'The deliverance of the children of Israel out of Egyptian bondage, through the parted Red Sea to Mount Sinai, decades in Kadesh-barnea, and arrival at the plains of Moab opposite Jericho.',
    scripture: 'Exodus 12 - Joshua 3',
    color: '#e4e4e7',
    dashArray: '6, 6',
    waypoints: [
      { name: 'Rameses / Goshen', coordinates: [30.5852, 31.5036], note: 'The First Passover and departure' },
      { name: 'Succoth', coordinates: [30.5500, 32.1000], note: 'First staging encampment' },
      { name: 'Red Sea Crossing', coordinates: [29.9668, 32.5498], note: 'Waters parted; Egyptian army destroyed' },
      { name: 'Marah & Elim', coordinates: [29.0500, 33.1500], note: 'Bitter waters sweetened; 12 springs & 70 palms' },
      { name: 'Mount Sinai', coordinates: [28.5392, 33.9750], note: 'Giving of the Ten Commandments & Tabernacle' },
      { name: 'Kadesh-barnea', coordinates: [30.6492, 34.4239], note: 'Spies sent out; forty years wandering decree' },
      { name: 'Mount Nebo', coordinates: [31.7683, 35.7253], note: 'Moses views Promised Land and is buried by God' },
      { name: 'Jericho (Crossing Jordan)', coordinates: [31.8667, 35.4500], note: 'Jordan dries up; Israel crosses into Canaan' },
    ],
  },
  {
    id: 'jesus-ministry-circuit',
    name: 'The Ministry Circuit of Jesus Christ',
    era: 'Gospels & Christ',
    figure: 'Jesus Christ',
    description: 'The earthly movements of Jesus: from boyhood in Nazareth, baptism in the Jordan, great Galilean ministry around Capernaum, journey through Samaria, to the final passion and resurrection in Jerusalem.',
    scripture: 'Gospels of Matthew, Mark, Luke & John',
    color: '#ffffff',
    waypoints: [
      { name: 'Bethlehem', coordinates: [31.7054, 35.2024], note: 'Nativity of Jesus in the city of David' },
      { name: 'Nazareth', coordinates: [32.7019, 35.3033], note: 'Childhood, maturation, and synagogue sermon' },
      { name: 'Jordan River (Bethany Beyond)', coordinates: [31.8333, 35.5500], note: 'Baptized by John; Holy Spirit descends' },
      { name: 'Wilderness of Judea', coordinates: [31.7500, 35.4000], note: 'Forty days fasting and victory over Satan' },
      { name: 'Capernaum', coordinates: [32.8804, 35.5753], note: 'Galilean headquarters; miracles & teachings' },
      { name: 'Sea of Galilee', coordinates: [32.8236, 35.5843], note: 'Calming the storm, walking on water' },
      { name: 'Shechem (Jacob\'s Well)', coordinates: [32.2139, 35.2858], note: 'Living water offered to the Samaritan woman' },
      { name: 'Bethany', coordinates: [31.7708, 35.2606], note: 'Lazarus raised; home of Mary & Martha' },
      { name: 'Jerusalem (Golgotha & Tomb)', coordinates: [31.7767, 35.2345], note: 'Triumphal entry, Last Supper, Crucifixion & Resurrection' },
    ],
  },
  {
    id: 'paul-second-missionary',
    name: 'Paul\'s 2nd Missionary Journey',
    era: 'Apostles & Early Church',
    figure: 'Apostle Paul & Silas',
    description: 'Paul and Silas travel across Asia Minor, heed the Macedonian Call into Europe, planting churches in Philippi, Thessalonica, Berea, Athens, and Corinth before returning to Antioch.',
    scripture: 'Acts 15:36 - 18:22',
    color: '#a1a1aa',
    dashArray: '4, 4',
    waypoints: [
      { name: 'Antioch of Syria', coordinates: [36.2021, 36.1606], note: 'Departure with Silas' },
      { name: 'Tarsus', coordinates: [36.9167, 34.8950], note: 'Revisiting home province of Cilicia' },
      { name: 'Derbe & Lystra', coordinates: [37.5833, 32.5000], note: 'Timothy joins the missionary team' },
      { name: 'Troas', coordinates: [39.7500, 26.1667], note: 'Macedonian Call vision ("Come over and help us")' },
      { name: 'Philippi', coordinates: [41.0131, 24.2858], note: 'Lydia\'s conversion and midnight prison praise' },
      { name: 'Thessalonica', coordinates: [40.6401, 22.9444], note: 'Reasoning in the synagogue for three Sabbaths' },
      { name: 'Berea', coordinates: [40.5219, 22.2025], note: 'Bereans search scriptures daily to confirm truth' },
      { name: 'Athens', coordinates: [37.9715, 23.7267], note: 'Mars Hill sermon to Greek philosophers' },
      { name: 'Corinth', coordinates: [37.9056, 22.8797], note: 'Eighteen-month church plant with Aquila & Priscilla' },
      { name: 'Ephesus', coordinates: [37.9497, 27.3639], note: 'Brief stop before sailing to Caesarea' },
      { name: 'Jerusalem', coordinates: [31.7767, 35.2345], note: 'Greets the mother church' },
      { name: 'Antioch', coordinates: [36.2021, 36.1606], note: 'Safe return and mission report' },
    ],
  },
  {
    id: 'paul-voyage-to-rome',
    name: 'Paul\'s Voyage to Rome',
    era: 'Apostles & Early Church',
    figure: 'Apostle Paul & Luke',
    description: 'Following his appeal to Caesar, Paul is transported by Roman centurions as a prisoner, survives a ferocious Mediterranean tempest and shipwreck at Malta, reaching Rome to preach unhindered.',
    scripture: 'Acts 27:1 - 28:31',
    color: '#71717a',
    dashArray: '8, 4',
    waypoints: [
      { name: 'Jerusalem', coordinates: [31.7767, 35.2345], note: 'Arrested in Temple; appeals to Caesar' },
      { name: 'Caesarea Maritima', coordinates: [32.5000, 34.8900], note: 'Two years imprisonment before Festus and Agrippa' },
      { name: 'Sidon', coordinates: [33.5631, 35.3689], note: 'Permitted to visit friends for refreshment' },
      { name: 'Myra in Lycia', coordinates: [36.2575, 29.9833], note: 'Transferred to Alexandrian grain ship' },
      { name: 'Fair Havens (Crete)', coordinates: [34.9333, 24.8167], note: 'Paul advises against sailing before winter' },
      { name: 'Malta (Shipwreck)', coordinates: [35.9375, 14.3754], note: 'Ship wrecked; all 276 souls saved; viper bite unharmed' },
      { name: 'Syracuse (Sicily)', coordinates: [37.0755, 15.2866], note: 'Three-day stopover' },
      { name: 'Puteoli', coordinates: [40.8267, 14.1206], note: 'Seven days with Christian brethren' },
      { name: 'Appii Forum', coordinates: [41.4500, 13.0000], note: 'Roman believers walk out to welcome Paul' },
      { name: 'Rome', coordinates: [41.9028, 12.4964], note: 'House arrest; preaching the Kingdom without hindrance' },
    ],
  },
];
