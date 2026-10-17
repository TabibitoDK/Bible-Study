export type RegionType =
  | 'Canaan & Israel'
  | 'Egypt & Sinai'
  | 'Mesopotamia'
  | 'Asia Minor & Greece'
  | 'Roman Empire';

export interface BiblicalEvent {
  id: string;
  title: string;
  era: string;
  eraOrder: number; // 1 to 8
  description: string;
  verses: string[];
  peopleIds: string[];
}

export interface BiblicalLocation {
  id: string;
  name: string;
  ancientName?: string;
  modernName: string;
  region: RegionType;
  coordinates: [number, number]; // [lat, lng]
  eraOrder: number; // 1 to 8: earliest biblical era this location appears
  description: string;
  events: BiblicalEvent[];
  scriptureRefs: string[];
  relatedPeople: string[];
}

export const BIBLICAL_LOCATIONS: BiblicalLocation[] = [
  {
    "id": "jerusalem",
    "name": "Jerusalem (Zion / Salem)",
    "ancientName": "יְרוּשָׁלַיִם / Jebus",
    "modernName": "Jerusalem",
    "region": "Canaan & Israel",
    "coordinates": [
      31.7767,
      35.2345
    ],
    "description": "The holy city of God, capital of David's united monarchy, site of Solomon's Temple, the crucifixion and resurrection of Jesus Christ, and the outpouring of the Holy Spirit at Pentecost.",
    "events": [
      {
        "id": "melchizedek-blessing",
        "title": "Melchizedek Blesses Abraham",
        "era": "Creation & Patriarchs",
        "description": "Melchizedek, King of Salem and Priest of God Most High, brings bread and wine and blesses Abraham after the battle.",
        "verses": [
          "Genesis 14:18-20",
          "Hebrews 7:1-4"
        ],
        "peopleIds": [
          "abraham"
        ],
        "eraOrder": 1
      },
      {
        "id": "david-captures-zion",
        "title": "David Conquers Jerusalem and Establishes Capital",
        "era": "Monarchy & Prophets",
        "description": "King David captures the Jebusite stronghold of Zion, bringing the Ark of the Covenant into the city with great joy and dancing.",
        "verses": [
          "2 Samuel 5:6-10",
          "2 Samuel 6:12-15"
        ],
        "peopleIds": [
          "david"
        ],
        "eraOrder": 4
      },
      {
        "id": "solomon-temple",
        "title": "Solomon Dedicates the First Temple",
        "era": "Monarchy & Prophets",
        "description": "King Solomon builds the glorious Temple on Mount Moriah; God's Shekinah glory descends in a cloud filling the sanctuary.",
        "verses": [
          "1 Kings 8:1-11",
          "2 Chronicles 7:1-3"
        ],
        "peopleIds": [
          "solomon"
        ],
        "eraOrder": 4
      },
      {
        "id": "crucifixion-resurrection",
        "title": "The Passion, Crucifixion & Resurrection of Christ",
        "era": "Gospels & Christ",
        "description": "Jesus institutes the Last Supper, suffers in Gethsemane, is condemned, crucified at Golgotha, and rises triumphantly from the tomb on the third day.",
        "verses": [
          "Matthew 27:32-56",
          "Matthew 28:1-10",
          "Luke 24:1-12",
          "John 19:16-30"
        ],
        "peopleIds": [
          "jesus",
          "peter",
          "john-apostle",
          "mary-mother",
          "mary-magdalene"
        ],
        "eraOrder": 7
      },
      {
        "id": "pentecost",
        "title": "Pentecost and the Birth of the Church",
        "era": "Apostles & Early Church",
        "description": "The Holy Spirit falls upon the disciples like tongues of fire; Peter preaches boldly and three thousand souls are baptized.",
        "verses": [
          "Acts 2:1-41"
        ],
        "peopleIds": [
          "peter",
          "john-apostle",
          "mary-mother"
        ],
        "eraOrder": 8
      }
    ],
    "scriptureRefs": [
      "Psalm 122:6",
      "Isaiah 2:3",
      "Luke 19:41-44",
      "Revelation 21:2"
    ],
    "relatedPeople": [
      "abraham",
      "david",
      "solomon",
      "hezekiah",
      "isaiah",
      "josiah",
      "jeremiah",
      "jesus",
      "peter",
      "john-apostle",
      "stephen",
      "paul",
      "james-brother"
    ],
    "eraOrder": 1
  },
  {
    "id": "bethlehem",
    "name": "Bethlehem (Ephrathah)",
    "ancientName": "בֵּית לֶחֶם",
    "modernName": "Bethlehem, West Bank",
    "region": "Canaan & Israel",
    "coordinates": [
      31.7054,
      35.2024
    ],
    "description": "City of David and birthplace of the Messiah Jesus Christ, nestled five miles south of Jerusalem; scene of the romance between Ruth and Boaz.",
    "events": [
      {
        "id": "rachel-burial",
        "title": "Death and Burial of Rachel",
        "era": "Creation & Patriarchs",
        "description": "Rachel dies giving birth to Benjamin on the way to Ephrath (Bethlehem) and is buried alongside the road.",
        "verses": [
          "Genesis 35:16-20"
        ],
        "peopleIds": [
          "jacob",
          "rachel",
          "benjamin"
        ],
        "eraOrder": 1
      },
      {
        "id": "ruth-boaz-redemption",
        "title": "Ruth and Boaz Kinsman-Redemption",
        "era": "Exodus & Judges",
        "description": "Ruth gleans in the barley fields of Boaz; Boaz redeems Naomi's estate and marries Ruth, fathering the line of David.",
        "verses": [
          "Ruth 2:1-7",
          "Ruth 4:13-17"
        ],
        "peopleIds": [
          "ruth",
          "boaz",
          "naomi"
        ],
        "eraOrder": 3
      },
      {
        "id": "samuel-anoints-david",
        "title": "Samuel Anoints Young David",
        "era": "Monarchy & Prophets",
        "description": "The prophet Samuel is sent by God to the house of Jesse in Bethlehem and anoints the youngest shepherd boy, David, as future king.",
        "verses": [
          "1 Samuel 16:1-13"
        ],
        "peopleIds": [
          "samuel",
          "david"
        ],
        "eraOrder": 4
      },
      {
        "id": "birth-of-jesus",
        "title": "Nativity of Jesus Christ",
        "era": "Gospels & Christ",
        "description": "Mary and Joseph travel from Nazareth for the census; Jesus is born in a manger, announced by angels to shepherds keeping watch by night.",
        "verses": [
          "Micah 5:2",
          "Luke 2:1-20",
          "Matthew 2:1-12"
        ],
        "peopleIds": [
          "jesus",
          "mary-mother",
          "joseph-husband"
        ],
        "eraOrder": 7
      }
    ],
    "scriptureRefs": [
      "Micah 5:2",
      "Matthew 2:5-6",
      "Luke 2:4"
    ],
    "relatedPeople": [
      "jacob",
      "rachel",
      "ruth",
      "boaz",
      "david",
      "samuel",
      "jesus",
      "mary-mother",
      "joseph-husband"
    ],
    "eraOrder": 1
  },
  {
    "id": "hebron",
    "name": "Hebron (Kiriath-arba / Mamre)",
    "ancientName": "חֶבְרוֹן",
    "modernName": "Al-Khalil / Hebron",
    "region": "Canaan & Israel",
    "coordinates": [
      31.5294,
      35.0998
    ],
    "description": "Ancient city situated in the Judean hills, home to the Oaks of Mamre and the Cave of Machpelah where Abraham, Sarah, Isaac, Rebekah, Jacob, and Leah were entombed.",
    "events": [
      {
        "id": "abraham-covenant-mamre",
        "title": "The Lord Visits Abraham at the Oaks of Mamre",
        "era": "Creation & Patriarchs",
        "description": "The Lord and two angels visit Abraham in human form; God promises that Sarah will give birth to Isaac within a year.",
        "verses": [
          "Genesis 18:1-15"
        ],
        "peopleIds": [
          "abraham",
          "sarah"
        ],
        "eraOrder": 1
      },
      {
        "id": "cave-of-machpelah",
        "title": "Abraham Buys the Cave of Machpelah",
        "era": "Creation & Patriarchs",
        "description": "Abraham purchases the field and cave from Ephron the Hittite as a perpetual family burying place for Sarah and subsequent patriarchs.",
        "verses": [
          "Genesis 23:1-20",
          "Genesis 49:29-33"
        ],
        "peopleIds": [
          "abraham",
          "sarah",
          "isaac",
          "rebekah",
          "jacob",
          "leah"
        ],
        "eraOrder": 1
      },
      {
        "id": "david-anointed-hebron",
        "title": "David Reigns Seven Years Over Judah in Hebron",
        "era": "Monarchy & Prophets",
        "description": "After Saul's death, David is anointed king over Judah in Hebron and reigns seven and a half years before capturing Jerusalem.",
        "verses": [
          "2 Samuel 2:1-4",
          "2 Samuel 5:1-3"
        ],
        "peopleIds": [
          "david"
        ],
        "eraOrder": 4
      }
    ],
    "scriptureRefs": [
      "Genesis 13:18",
      "Genesis 23:2",
      "Joshua 14:13-15"
    ],
    "relatedPeople": [
      "abraham",
      "sarah",
      "isaac",
      "rebekah",
      "jacob",
      "leah",
      "caleb",
      "david"
    ],
    "eraOrder": 1
  },
  {
    "id": "nazareth",
    "name": "Nazareth",
    "ancientName": "נָצְרַת",
    "modernName": "Nazareth, Lower Galilee",
    "region": "Canaan & Israel",
    "coordinates": [
      32.7019,
      35.3033
    ],
    "description": "Humble hillside village in lower Galilee where the Angel Gabriel announced the Incarnation to Mary, and where Jesus grew in wisdom and stature.",
    "events": [
      {
        "id": "annunciation",
        "title": "The Annunciation of the Angel Gabriel to Mary",
        "era": "Gospels & Christ",
        "description": "The Angel Gabriel appears to the virgin Mary announcing that she will conceive by the Holy Spirit and bear the Son of the Most High.",
        "verses": [
          "Luke 1:26-38"
        ],
        "peopleIds": [
          "mary-mother",
          "jesus"
        ],
        "eraOrder": 7
      },
      {
        "id": "boyhood-of-jesus",
        "title": "Childhood & Maturation of Jesus",
        "era": "Gospels & Christ",
        "description": "Jesus grows up in the household of Joseph the carpenter, in subjection to his parents, increasing in wisdom and favor with God and man.",
        "verses": [
          "Luke 2:39-40",
          "Luke 2:51-52",
          "Matthew 2:23"
        ],
        "peopleIds": [
          "jesus",
          "mary-mother",
          "joseph-husband"
        ],
        "eraOrder": 7
      },
      {
        "id": "rejection-at-nazareth",
        "title": "Jesus Preaches in the Synagogue and is Rejected",
        "era": "Gospels & Christ",
        "description": "Jesus unrolls the scroll of Isaiah (\"The Spirit of the Lord is upon me\"), proclaims its fulfillment, and the townspeople attempt to cast Him off a cliff.",
        "verses": [
          "Luke 4:16-30"
        ],
        "peopleIds": [
          "jesus"
        ],
        "eraOrder": 7
      }
    ],
    "scriptureRefs": [
      "Matthew 2:23",
      "John 1:46",
      "Acts 10:38"
    ],
    "relatedPeople": [
      "jesus",
      "mary-mother",
      "joseph-husband",
      "james-brother"
    ],
    "eraOrder": 7
  },
  {
    "id": "capernaum",
    "name": "Capernaum (Kfar Nahum)",
    "ancientName": "כְּפַר נַחוּם",
    "modernName": "Capernaum / Kfar Nahum",
    "region": "Canaan & Israel",
    "coordinates": [
      32.8804,
      35.5753
    ],
    "description": "Bustling fishing city on the northern shore of the Sea of Galilee; known as Jesus' \"own city\" and the headquarters of His Galilean ministry.",
    "events": [
      {
        "id": "calling-disciples-capernaum",
        "title": "Jesus Calls Peter, Andrew, James, John, and Matthew",
        "era": "Gospels & Christ",
        "description": "Jesus calls fishermen at the shore and Matthew at the customs booth: \"Follow Me, and I will make you fishers of men.\"",
        "verses": [
          "Matthew 4:18-22",
          "Matthew 9:9-13",
          "Mark 1:16-20"
        ],
        "peopleIds": [
          "jesus",
          "peter",
          "andrew",
          "james-zebedee",
          "john-apostle",
          "matthew"
        ],
        "eraOrder": 7
      },
      {
        "id": "healing-paralytic",
        "title": "Jesus Heals the Paralytic Let Down Through the Roof",
        "era": "Gospels & Christ",
        "description": "Four faithful friends lower a paralyzed man through the roof of Peter's house; Jesus forgives his sins and heals his body.",
        "verses": [
          "Mark 2:1-12"
        ],
        "peopleIds": [
          "jesus"
        ],
        "eraOrder": 7
      },
      {
        "id": "bread-of-life-discourse",
        "title": "The Bread of Life Discourse in the Synagogue",
        "era": "Gospels & Christ",
        "description": "In the Capernaum synagogue, Jesus declares: \"I am the bread of life: he that cometh to me shall never hunger.\"",
        "verses": [
          "John 6:22-59"
        ],
        "peopleIds": [
          "jesus",
          "peter"
        ],
        "eraOrder": 7
      }
    ],
    "scriptureRefs": [
      "Matthew 4:13",
      "Matthew 11:23",
      "Mark 2:1"
    ],
    "relatedPeople": [
      "jesus",
      "peter",
      "andrew",
      "james-zebedee",
      "john-apostle",
      "matthew"
    ],
    "eraOrder": 7
  },
  {
    "id": "sea-of-galilee",
    "name": "Sea of Galilee (Lake Kinneret / Tiberias)",
    "ancientName": "יָם כִּנֶּרֶת",
    "modernName": "Lake Kinneret",
    "region": "Canaan & Israel",
    "coordinates": [
      32.8236,
      35.5843
    ],
    "description": "Freshwater lake 700 feet below sea level, surrounded by rolling hills; the theater of Jesus' mighty nature miracles, boat sermons, and post-resurrection breakfast.",
    "events": [
      {
        "id": "calming-the-storm",
        "title": "Jesus Rebukes the Wind and Calms the Sea",
        "era": "Gospels & Christ",
        "description": "As a fierce squall threatens to swamp the disciples' boat, Jesus awakes and commands: \"Peace, be still!\" and the wind ceases.",
        "verses": [
          "Mark 4:35-41",
          "Matthew 8:23-27"
        ],
        "peopleIds": [
          "jesus",
          "peter",
          "john-apostle"
        ],
        "eraOrder": 7
      },
      {
        "id": "walking-on-water",
        "title": "Jesus Walks on the Water and Invites Peter",
        "era": "Gospels & Christ",
        "description": "In the fourth watch of the night, Jesus walks across the waves; Peter steps out of the boat to meet Him in faith.",
        "verses": [
          "Matthew 14:22-33",
          "John 6:16-21"
        ],
        "peopleIds": [
          "jesus",
          "peter"
        ],
        "eraOrder": 7
      },
      {
        "id": "miraculous-catch-restoration",
        "title": "The 153 Large Fish and Restoration of Peter",
        "era": "Gospels & Christ",
        "description": "The risen Lord appears on the shore at dawn, prepares fish on hot coals, and asks Peter three times: \"Simon, son of Jonas, lovest thou me?\"",
        "verses": [
          "John 21:1-19"
        ],
        "peopleIds": [
          "jesus",
          "peter",
          "john-apostle",
          "thomas"
        ],
        "eraOrder": 7
      }
    ],
    "scriptureRefs": [
      "Matthew 4:18",
      "Luke 5:1-11",
      "John 6:1"
    ],
    "relatedPeople": [
      "jesus",
      "peter",
      "andrew",
      "james-zebedee",
      "john-apostle"
    ],
    "eraOrder": 7
  },
  {
    "id": "shechem",
    "name": "Shechem (Sychar)",
    "ancientName": "שְׁכֶם",
    "modernName": "Nablus, West Bank",
    "region": "Canaan & Israel",
    "coordinates": [
      32.2139,
      35.2858
    ],
    "description": "Strategic valley between Mount Gerizim and Mount Ebal; first campsite of Abraham in Canaan, location of Jacob's well, and covenant renewal site under Joshua.",
    "events": [
      {
        "id": "abraham-first-altar",
        "title": "Abraham Builds First Altar in Canaan",
        "era": "Creation & Patriarchs",
        "description": "Arriving in Canaan from Haran, Abraham halts at the Oak of Moreh in Shechem; Yahweh promises the land, and Abraham builds an altar.",
        "verses": [
          "Genesis 12:6-7"
        ],
        "peopleIds": [
          "abraham"
        ],
        "eraOrder": 1
      },
      {
        "id": "joshua-covenant-renewal",
        "title": "Joshua's Farewell Address & Covenant Stone",
        "era": "Exodus & Judges",
        "description": "Joshua gathers all tribes at Shechem: \"Choose you this day whom ye will serve... but as for me and my house, we will serve the Lord.\"",
        "verses": [
          "Joshua 24:1-27"
        ],
        "peopleIds": [
          "joshua"
        ],
        "eraOrder": 2
      },
      {
        "id": "woman-at-the-well",
        "title": "Jesus and the Samaritan Woman at Jacob's Well",
        "era": "Gospels & Christ",
        "description": "Wearied from his journey, Jesus sits at Jacob's well in Sychar at noon, offering living water to a Samaritan woman and unveiling Himself as Messiah.",
        "verses": [
          "John 4:5-42"
        ],
        "peopleIds": [
          "jesus"
        ],
        "eraOrder": 7
      }
    ],
    "scriptureRefs": [
      "Genesis 33:18-20",
      "Joshua 24:32",
      "John 4:5"
    ],
    "relatedPeople": [
      "abraham",
      "jacob",
      "joseph",
      "joshua",
      "jesus"
    ],
    "eraOrder": 1
  },
  {
    "id": "jericho",
    "name": "Jericho (City of Palm Trees)",
    "ancientName": "יְרִיחוֹ",
    "modernName": "Jericho, Jordan Valley",
    "region": "Canaan & Israel",
    "coordinates": [
      31.8667,
      35.45
    ],
    "description": "The oldest continually inhabited city on earth, located in the Jordan Rift Valley 800 feet below sea level; first city conquered by Joshua.",
    "events": [
      {
        "id": "fall-of-jericho",
        "title": "The Walls of Jericho Collapse",
        "era": "Exodus & Judges",
        "description": "Israel marches around Jericho once daily for six days and seven times on the seventh day; upon the priests' trumpet blast and the people's shout, the walls collapse flat.",
        "verses": [
          "Joshua 6:1-21",
          "Hebrews 11:30"
        ],
        "peopleIds": [
          "joshua",
          "rahab"
        ],
        "eraOrder": 3
      },
      {
        "id": "elisha-spring",
        "title": "Elisha Heals Jericho's Poisonous Spring with Salt",
        "era": "Monarchy & Prophets",
        "description": "The men of Jericho complain of bitter water; Elisha casts salt from a new bowl into the spring, declaring it healed forever.",
        "verses": [
          "2 Kings 2:19-22"
        ],
        "peopleIds": [
          "elisha"
        ],
        "eraOrder": 5
      },
      {
        "id": "zacchaeus-jericho",
        "title": "Jesus Meets Zacchaeus and Heals Bartimaeus",
        "era": "Gospels & Christ",
        "description": "Chief tax collector Zacchaeus climbs a sycamore tree to see Jesus; Jesus visits his home declaring salvation, and opens blind Bartimaeus' eyes.",
        "verses": [
          "Luke 19:1-10",
          "Mark 10:46-52"
        ],
        "peopleIds": [
          "jesus"
        ],
        "eraOrder": 7
      }
    ],
    "scriptureRefs": [
      "Deuteronomy 34:3",
      "Joshua 6:26",
      "Hebrews 11:30"
    ],
    "relatedPeople": [
      "joshua",
      "rahab",
      "elisha",
      "jesus"
    ],
    "eraOrder": 3
  },
  {
    "id": "bethel",
    "name": "Bethel (Luz)",
    "ancientName": "בֵּית־אֵל (House of God)",
    "modernName": "Beitin, West Bank",
    "region": "Canaan & Israel",
    "coordinates": [
      31.9284,
      35.2415
    ],
    "description": "Ancient highland sanctuary where Jacob saw the heavenly ladder and where Jeroboam later erected an idolatrous golden calf.",
    "events": [
      {
        "id": "jacob-ladder",
        "title": "Jacob's Dream of the Heavenly Ladder",
        "era": "Creation & Patriarchs",
        "description": "Fleeing from Esau, Jacob rests his head upon a stone and dreams of a ladder reaching heaven with angels ascending and descending.",
        "verses": [
          "Genesis 28:10-22"
        ],
        "peopleIds": [
          "jacob"
        ],
        "eraOrder": 1
      },
      {
        "id": "jeroboam-golden-calf",
        "title": "Jeroboam Erects the Golden Calf at Bethel",
        "era": "Monarchy & Prophets",
        "description": "King Jeroboam I sets up golden calves at Bethel and Dan to prevent northern Israelites from pilgrimage to the Temple in Jerusalem.",
        "verses": [
          "1 Kings 12:28-33",
          "1 Kings 13:1-5"
        ],
        "peopleIds": [
          "jeroboam"
        ],
        "eraOrder": 5
      }
    ],
    "scriptureRefs": [
      "Genesis 12:8",
      "Genesis 35:1-7",
      "Amos 4:4"
    ],
    "relatedPeople": [
      "abraham",
      "jacob",
      "jeroboam",
      "deborah"
    ],
    "eraOrder": 1
  },
  {
    "id": "carmel",
    "name": "Mount Carmel",
    "ancientName": "הַר הַכַּרְמֶל",
    "modernName": "Mount Carmel / Haifa",
    "region": "Canaan & Israel",
    "coordinates": [
      32.7486,
      35.0394
    ],
    "description": "Verdant coastal mountain ridge famous for its lush beauty and the dramatic showdown between Elijah and the 450 prophets of Baal.",
    "events": [
      {
        "id": "elijah-fire-carmel",
        "title": "Elijah Calls Down Fire from Heaven",
        "era": "Monarchy & Prophets",
        "description": "Elijah challenges the prophets of Baal before all Israel; Yahweh answers with fire from heaven that consumes sacrifice, wood, stones, and water.",
        "verses": [
          "1 Kings 18:20-40"
        ],
        "peopleIds": [
          "elijah",
          "ahab"
        ],
        "eraOrder": 5
      }
    ],
    "scriptureRefs": [
      "Song of Solomon 7:5",
      "Isaiah 35:2",
      "Jeremiah 46:18"
    ],
    "relatedPeople": [
      "elijah",
      "elisha",
      "ahab"
    ],
    "eraOrder": 5
  },
  {
    "id": "shiloh",
    "name": "Shiloh",
    "ancientName": "שִׁלֹה",
    "modernName": "Khirbet Seilun / Tel Shiloh",
    "region": "Canaan & Israel",
    "coordinates": [
      32.0558,
      35.2897
    ],
    "description": "First permanent religious capital of Israel during the Judges era; site of the Tabernacle and the Ark for over three centuries.",
    "events": [
      {
        "id": "tabernacle-at-shiloh",
        "title": "Tabernacle Pitched & Land Divided",
        "era": "Exodus & Judges",
        "description": "Joshua pitches the Tabernacle of the congregation at Shiloh and casts lots before the Lord to divide Canaan among the tribes.",
        "verses": [
          "Joshua 18:1-10"
        ],
        "peopleIds": [
          "joshua"
        ],
        "eraOrder": 2
      },
      {
        "id": "hannah-prayer-samuel-call",
        "title": "Hannah's Vow and God's Call to Young Samuel",
        "era": "Exodus & Judges",
        "description": "Hannah weeps before God at Shiloh praying for a child; Samuel is born and dedicated here, where God calls him audibly by name in the night.",
        "verses": [
          "1 Samuel 1:9-28",
          "1 Samuel 3:1-21"
        ],
        "peopleIds": [
          "samuel"
        ],
        "eraOrder": 3
      }
    ],
    "scriptureRefs": [
      "Judges 21:19",
      "Psalm 78:60",
      "Jeremiah 7:12-14"
    ],
    "relatedPeople": [
      "joshua",
      "samuel"
    ],
    "eraOrder": 2
  },
  {
    "id": "samaria",
    "name": "Samaria (Shomron / Sebaste)",
    "ancientName": "שֹׁמְרוֹן",
    "modernName": "Sebastia",
    "region": "Canaan & Israel",
    "coordinates": [
      32.2764,
      35.1914
    ],
    "description": "Fortified hill purchased by King Omri, serving as royal capital of the Northern Kingdom of Israel until its fall to the Assyrians in 722 BC.",
    "events": [
      {
        "id": "omri-founds-samaria",
        "title": "Omri & Ahab Build Capital and Ivory Palace",
        "era": "Monarchy & Prophets",
        "description": "King Omri buys the hill of Samaria and builds the fortress capital; Ahab decorates it with an ivory palace and a temple of Baal.",
        "verses": [
          "1 Kings 16:24",
          "1 Kings 22:39",
          "Amos 3:15"
        ],
        "peopleIds": [
          "ahab",
          "jezebel"
        ],
        "eraOrder": 5
      },
      {
        "id": "syrian-siege-lepers",
        "title": "Four Lepers Discover Abandoned Syrian Camp",
        "era": "Monarchy & Prophets",
        "description": "During a terrible famine inside besieged Samaria, Elisha prophesies abundance tomorrow; four lepers discover the Syrians have fled in panic.",
        "verses": [
          "2 Kings 7:1-16"
        ],
        "peopleIds": [
          "elisha"
        ],
        "eraOrder": 5
      }
    ],
    "scriptureRefs": [
      "1 Kings 16:24",
      "2 Kings 17:5-6",
      "Hosea 8:5"
    ],
    "relatedPeople": [
      "ahab",
      "jezebel",
      "elijah",
      "elisha"
    ],
    "eraOrder": 5
  },
  {
    "id": "goshen",
    "name": "Land of Goshen (Rameses)",
    "ancientName": "אֶרֶץ גֹּשֶׁן",
    "modernName": "Eastern Nile Delta, Egypt",
    "region": "Egypt & Sinai",
    "coordinates": [
      30.5852,
      31.5036
    ],
    "description": "Fertile pasturage in the eastern Nile Delta given to Jacob's family during the Egyptian famine; site where the Israelites multiplied and endured slavery.",
    "events": [
      {
        "id": "jacob-settles-goshen",
        "title": "Jacob and His Sons Settle in Goshen",
        "era": "Creation & Patriarchs",
        "description": "Pharaoh grants Jacob's family the best of the land in Goshen; Joseph nourishes his father, brothers, and all their households.",
        "verses": [
          "Genesis 46:28-34",
          "Genesis 47:1-6"
        ],
        "peopleIds": [
          "jacob",
          "joseph",
          "judah",
          "benjamin"
        ],
        "eraOrder": 1
      },
      {
        "id": "first-passover-exodus",
        "title": "The First Passover & Midnight Exodus",
        "era": "Exodus & Judges",
        "description": "Israel slaughters the unblemished lamb, paints the blood on the doorposts, eats unleavened bread, and marches out of Egypt by night.",
        "verses": [
          "Exodus 12:1-36"
        ],
        "peopleIds": [
          "moses",
          "aaron",
          "miriam"
        ],
        "eraOrder": 2
      }
    ],
    "scriptureRefs": [
      "Genesis 45:10",
      "Exodus 8:22",
      "Exodus 9:26"
    ],
    "relatedPeople": [
      "jacob",
      "joseph",
      "moses",
      "aaron",
      "miriam"
    ],
    "eraOrder": 1
  },
  {
    "id": "red-sea",
    "name": "Red Sea Crossing (Yam Suph)",
    "ancientName": "יַם־סוּף",
    "modernName": "Gulf of Suez / Bitter Lakes",
    "region": "Egypt & Sinai",
    "coordinates": [
      29.9668,
      32.5498
    ],
    "description": "The monumental body of water where God demonstrated His mighty power, parting the waves before Israel and overwhelming Pharaoh's pursuing chariots.",
    "events": [
      {
        "id": "parting-of-red-sea",
        "title": "The Miraculous Parting of the Red Sea",
        "era": "Exodus & Judges",
        "description": "Moses stretches out his hand over the sea; God drives the sea back with a strong east wind all night, and the children of Israel walk across on dry ground.",
        "verses": [
          "Exodus 14:13-31",
          "Exodus 15:1-21",
          "Hebrews 11:29"
        ],
        "peopleIds": [
          "moses",
          "aaron",
          "miriam"
        ],
        "eraOrder": 2
      }
    ],
    "scriptureRefs": [
      "Exodus 14:21",
      "Psalm 106:9",
      "1 Corinthians 10:1-2"
    ],
    "relatedPeople": [
      "moses",
      "aaron",
      "miriam"
    ],
    "eraOrder": 2
  },
  {
    "id": "sinai",
    "name": "Mount Sinai (Mount Horeb / Jebel Musa)",
    "ancientName": "הַר סִינַי / חֹרֵב",
    "modernName": "Sinai Peninsula, Egypt",
    "region": "Egypt & Sinai",
    "coordinates": [
      28.5392,
      33.975
    ],
    "description": "The holy mountain of God wrapped in smoke, thunder, and fire where the Lord entered into covenant with Israel, giving the Ten Commandments and Tabernacle blueprint.",
    "events": [
      {
        "id": "burning-bush",
        "title": "Moses and the Burning Bush",
        "era": "Exodus & Judges",
        "description": "Moses sees a bush burning with fire yet not consumed; God speaks out of the midst: \"I AM THAT I AM.\"",
        "verses": [
          "Exodus 3:1-14"
        ],
        "peopleIds": [
          "moses"
        ],
        "eraOrder": 2
      },
      {
        "id": "giving-of-ten-commandments",
        "title": "Giving of the Law and the Ten Commandments",
        "era": "Exodus & Judges",
        "description": "Amidst lightning, earthquakes, and trumpet blasts, Moses ascends the mountain and receives the two tablets of stone inscribed by the finger of God.",
        "verses": [
          "Exodus 19:16-25",
          "Exodus 20:1-17",
          "Exodus 31:18"
        ],
        "peopleIds": [
          "moses",
          "aaron",
          "joshua"
        ],
        "eraOrder": 2
      },
      {
        "id": "elijah-still-small-voice",
        "title": "Elijah Hears the Still Small Voice at Horeb",
        "era": "Monarchy & Prophets",
        "description": "Fleeing from Jezebel, Elijah journeys forty days to Mount Horeb; God passes by not in the wind, earthquake, or fire, but in a still, small voice.",
        "verses": [
          "1 Kings 19:8-18"
        ],
        "peopleIds": [
          "elijah"
        ],
        "eraOrder": 5
      }
    ],
    "scriptureRefs": [
      "Exodus 19:11",
      "Deuteronomy 4:10",
      "Galatians 4:24-25"
    ],
    "relatedPeople": [
      "moses",
      "aaron",
      "joshua",
      "elijah"
    ],
    "eraOrder": 2
  },
  {
    "id": "kadesh-barnea",
    "name": "Kadesh-barnea (En-mishpat)",
    "ancientName": "קָדֵשׁ בַּרְנֵעַ",
    "modernName": "Ain el-Qudeirat, Sinai/Negev",
    "region": "Egypt & Sinai",
    "coordinates": [
      30.6492,
      34.4239
    ],
    "description": "Oasis sanctuary in the Wilderness of Zin where Israel encamped for decades, sent out the twelve spies, and where Moses struck the rock at Meribah.",
    "events": [
      {
        "id": "spies-sent-out",
        "title": "Twelve Spies Sent into Canaan",
        "era": "Exodus & Judges",
        "description": "Twelve leaders are sent to explore Canaan; ten bring back an evil report causing Israel to wander forty years, while Joshua and Caleb urge faith.",
        "verses": [
          "Numbers 13:1-33",
          "Numbers 14:1-10"
        ],
        "peopleIds": [
          "moses",
          "joshua",
          "caleb"
        ],
        "eraOrder": 2
      },
      {
        "id": "water-from-rock-meribah",
        "title": "Moses Strikes the Rock at Meribah",
        "era": "Exodus & Judges",
        "description": "When people quarrel for lack of water, Moses angrily strikes the rock twice instead of speaking to it, forfeiting entrance into the Promised Land.",
        "verses": [
          "Numbers 20:1-13"
        ],
        "peopleIds": [
          "moses",
          "aaron"
        ],
        "eraOrder": 2
      }
    ],
    "scriptureRefs": [
      "Genesis 14:7",
      "Numbers 32:8",
      "Deuteronomy 1:19"
    ],
    "relatedPeople": [
      "moses",
      "aaron",
      "miriam",
      "joshua",
      "caleb"
    ],
    "eraOrder": 2
  },
  {
    "id": "nebo",
    "name": "Mount Nebo (Pisgah)",
    "ancientName": "הַר נְבוֹ",
    "modernName": "Mount Nebo, Jordan",
    "region": "Canaan & Israel",
    "coordinates": [
      31.7683,
      35.7253
    ],
    "description": "Mountain ridge east of the Jordan overlooking the entire Promised Land; summit where Moses viewed the land before his death and burial by God.",
    "events": [
      {
        "id": "moses-views-land-and-dies",
        "title": "Moses Views the Promised Land and Dies",
        "era": "Exodus & Judges",
        "description": "The Lord shows Moses the panorama from Gilead to Dan, Judah to the Mediterranean Sea; Moses dies at 120 years, his eye undimmed, and the Lord buries him.",
        "verses": [
          "Deuteronomy 34:1-8"
        ],
        "peopleIds": [
          "moses"
        ],
        "eraOrder": 2
      }
    ],
    "scriptureRefs": [
      "Numbers 27:12-14",
      "Deuteronomy 3:27",
      "Deuteronomy 34:1"
    ],
    "relatedPeople": [
      "moses",
      "joshua"
    ],
    "eraOrder": 2
  },
  {
    "id": "ur",
    "name": "Ur of the Chaldees",
    "ancientName": "אוּר כַּשְׂדִּים",
    "modernName": "Tell el-Muqayyar, Southern Iraq",
    "region": "Mesopotamia",
    "coordinates": [
      30.9628,
      46.1031
    ],
    "description": "Prominent Sumerian metropolis and ziggurat center on the Euphrates River; original homeland of Abraham before God called him out to Canaan.",
    "events": [
      {
        "id": "call-of-abram",
        "title": "God Calls Abram Out of Ur",
        "era": "Creation & Patriarchs",
        "description": "The God of glory appears to Abram in Mesopotamia: \"Get thee out of thy country, and from thy kindred, and come into the land which I shall shew thee.\"",
        "verses": [
          "Genesis 11:28-31",
          "Acts 7:2-4",
          "Hebrews 11:8"
        ],
        "peopleIds": [
          "abraham",
          "sarah",
          "terah",
          "lot"
        ],
        "eraOrder": 1
      }
    ],
    "scriptureRefs": [
      "Genesis 11:31",
      "Genesis 15:7",
      "Nehemiah 9:7"
    ],
    "relatedPeople": [
      "abraham",
      "sarah",
      "terah",
      "lot"
    ],
    "eraOrder": 1
  },
  {
    "id": "haran",
    "name": "Haran (Paddan-aram)",
    "ancientName": "חָרָן",
    "modernName": "Harran, Southern Turkey",
    "region": "Mesopotamia",
    "coordinates": [
      36.8647,
      39.0272
    ],
    "description": "Key trading junction on the Balikh River where Terah died, where Abraham tarried before entering Canaan, and where Jacob fled to Laban.",
    "events": [
      {
        "id": "terah-dies-abraham-departs",
        "title": "Terah Dies and Abraham Departs for Canaan",
        "era": "Creation & Patriarchs",
        "description": "Terah settles and dies in Haran; at age 75, Abraham departs with Sarah and Lot in full obedience to God's covenant promise.",
        "verses": [
          "Genesis 11:32",
          "Genesis 12:4-5"
        ],
        "peopleIds": [
          "abraham",
          "sarah",
          "terah",
          "lot"
        ],
        "eraOrder": 1
      },
      {
        "id": "jacob-serves-laban",
        "title": "Jacob Serves Laban for Leah and Rachel",
        "era": "Creation & Patriarchs",
        "description": "Jacob arrives in Haran, meets Rachel at the well, and serves her father Laban twenty years, fathering eleven sons before returning.",
        "verses": [
          "Genesis 29:1-30",
          "Genesis 31:38-42"
        ],
        "peopleIds": [
          "jacob",
          "leah",
          "rachel"
        ],
        "eraOrder": 1
      }
    ],
    "scriptureRefs": [
      "Genesis 24:10",
      "Genesis 27:43",
      "Acts 7:4"
    ],
    "relatedPeople": [
      "abraham",
      "sarah",
      "terah",
      "rebekah",
      "jacob",
      "leah",
      "rachel"
    ],
    "eraOrder": 1
  },
  {
    "id": "babylon",
    "name": "Babylon (Babel)",
    "ancientName": "בָּבֶל",
    "modernName": "Hillah, Babil Governorate, Iraq",
    "region": "Mesopotamia",
    "coordinates": [
      32.5422,
      44.421
    ],
    "description": "Capital of the Neo-Babylonian Empire under Nebuchadnezzar; site of the Tower of Babel, the destruction of Jerusalem's Temple in 586 BC, and the 70-year Jewish exile.",
    "events": [
      {
        "id": "tower-of-babel",
        "title": "The Tower of Babel and Confusion of Tongues",
        "era": "Creation & Patriarchs",
        "description": "Mankind attempts to build a city and a tower whose top reaches to heaven; God confuses their language and scatters them across the earth.",
        "verses": [
          "Genesis 11:1-9"
        ],
        "peopleIds": [
          "noah"
        ],
        "eraOrder": 1
      },
      {
        "id": "fiery-furnace-daniel-lions",
        "title": "The Fiery Furnace and Daniel in the Lions' Den",
        "era": "Exile & Return",
        "description": "Shadrach, Meshach, and Abednego survive the seven-times-heated furnace with the Son of God; Daniel is spared unhurt in the lions' den.",
        "verses": [
          "Daniel 3:19-27",
          "Daniel 6:10-23"
        ],
        "peopleIds": [
          "daniel"
        ],
        "eraOrder": 6
      },
      {
        "id": "ezekiel-visions-chebar",
        "title": "Ezekiel's Visions by the River Chebar",
        "era": "Exile & Return",
        "description": "Among Jewish captives in Babylon, the heavens open and Ezekiel sees visions of God's chariot throne, four living creatures, and the valley of dry bones.",
        "verses": [
          "Ezekiel 1:1-3",
          "Ezekiel 37:1-14"
        ],
        "peopleIds": [
          "ezekiel"
        ],
        "eraOrder": 6
      }
    ],
    "scriptureRefs": [
      "2 Kings 25:1-11",
      "Psalm 137:1-4",
      "Jeremiah 29:10",
      "Revelation 17:5"
    ],
    "relatedPeople": [
      "daniel",
      "ezekiel",
      "ezra"
    ],
    "eraOrder": 1
  },
  {
    "id": "nineveh",
    "name": "Nineveh",
    "ancientName": "נִינְוֵה",
    "modernName": "Mosul, Northern Iraq",
    "region": "Mesopotamia",
    "coordinates": [
      36.3589,
      43.1528
    ],
    "description": "Mighty capital of the Assyrian Empire on the Tigris River; destination of Jonah's reluctant preaching and site of unexpected citywide repentance.",
    "events": [
      {
        "id": "jonah-preaches-nineveh",
        "title": "Jonah Preaches and Nineveh Repents in Sackcloth",
        "era": "Monarchy & Prophets",
        "description": "Jonah delivers God's message: \"Yet forty days, and Nineveh shall be overthrown!\" The king, people, and even beasts fast in sackcloth and ashes, averting destruction.",
        "verses": [
          "Jonah 3:1-10",
          "Matthew 12:41"
        ],
        "peopleIds": [],
        "eraOrder": 4
      }
    ],
    "scriptureRefs": [
      "Genesis 10:11",
      "Nahum 1:1",
      "Zephaniah 2:13"
    ],
    "relatedPeople": [],
    "eraOrder": 4
  },
  {
    "id": "susa",
    "name": "Susa (Shushan)",
    "ancientName": "שׁוּשַׁן",
    "modernName": "Shush, Khuzestan Province, Iran",
    "region": "Mesopotamia",
    "coordinates": [
      32.1894,
      48.2433
    ],
    "description": "Winter capital of the Persian Achaemenid Empire; setting of the Book of Esther and the starting point of Nehemiah's return mission to rebuild Jerusalem.",
    "events": [
      {
        "id": "esther-saves-jews",
        "title": "Queen Esther Saves Her People from Genocide",
        "era": "Exile & Return",
        "description": "Esther invites King Ahasuerus and Haman to banquets, courageously reveals her Jewish identity, exposes Haman's plot, and establishes the Feast of Purim.",
        "verses": [
          "Esther 5:1-8",
          "Esther 7:1-10",
          "Esther 9:20-28"
        ],
        "peopleIds": [
          "esther",
          "mordecai"
        ],
        "eraOrder": 6
      },
      {
        "id": "nehemiah-weeps-susa",
        "title": "Nehemiah Weeps and Prays in the Palace of Susa",
        "era": "Exile & Return",
        "description": "Serving as royal cupbearer, Nehemiah mourns Jerusalem's broken walls and wins King Artaxerxes' permission to return and rebuild.",
        "verses": [
          "Nehemiah 1:1-11",
          "Nehemiah 2:1-8"
        ],
        "peopleIds": [
          "nehemiah"
        ],
        "eraOrder": 6
      }
    ],
    "scriptureRefs": [
      "Daniel 8:2",
      "Esther 1:2",
      "Nehemiah 1:1"
    ],
    "relatedPeople": [
      "esther",
      "mordecai",
      "nehemiah",
      "daniel"
    ],
    "eraOrder": 6
  },
  {
    "id": "ararat",
    "name": "Mount Ararat",
    "ancientName": "הָרֵי אֲרָרָט",
    "modernName": "Ağrı Dağı, Eastern Turkey",
    "region": "Mesopotamia",
    "coordinates": [
      39.7025,
      44.2992
    ],
    "description": "Majestic volcanic mountain massif rising above the Armenian highlands; resting place of Noah's Ark following the subsidence of the Deluge.",
    "events": [
      {
        "id": "ark-rests-ararat",
        "title": "The Ark Rests on Ararat & God's Rainbow Covenant",
        "era": "Creation & Patriarchs",
        "description": "The waters abate, the Ark rests upon Mount Ararat, Noah sends forth a raven and a dove, and God establishes the rainbow as token of His covenant.",
        "verses": [
          "Genesis 8:4-22",
          "Genesis 9:11-17"
        ],
        "peopleIds": [
          "noah",
          "shem"
        ],
        "eraOrder": 1
      }
    ],
    "scriptureRefs": [
      "Genesis 8:4",
      "2 Kings 19:37",
      "Jeremiah 51:27"
    ],
    "relatedPeople": [
      "noah",
      "shem"
    ],
    "eraOrder": 1
  },
  {
    "id": "damascus",
    "name": "Damascus",
    "ancientName": "דַּמֶּשֶׂק / Δαμασκός",
    "modernName": "Damascus, Syria",
    "region": "Asia Minor & Greece",
    "coordinates": [
      33.5138,
      36.2765
    ],
    "description": "One of the oldest continuously inhabited cities; site of Saul's dramatic blinding vision of the resurrected Christ on the road to Damascus.",
    "events": [
      {
        "id": "paul-conversion-damascus",
        "title": "The Conversion of Saul of Tarsus",
        "era": "Apostles & Early Church",
        "description": "A blinding light from heaven flashes around persecuting Saul: \"Saul, Saul, why persecutest thou me?\" In Damascus, Ananias restores his sight and baptizes him.",
        "verses": [
          "Acts 9:1-19",
          "Acts 22:6-16",
          "Acts 26:12-18"
        ],
        "peopleIds": [
          "paul"
        ],
        "eraOrder": 8
      },
      {
        "id": "paul-escapes-basket",
        "title": "Paul Escapes Damascus in a Basket",
        "era": "Apostles & Early Church",
        "description": "When opponents watch the gates day and night to assassinate Paul, disciples lower him down over the city wall by night in a large basket.",
        "verses": [
          "Acts 9:23-25",
          "2 Corinthians 11:32-33"
        ],
        "peopleIds": [
          "paul"
        ],
        "eraOrder": 8
      }
    ],
    "scriptureRefs": [
      "Genesis 15:2",
      "1 Kings 19:15",
      "Acts 9:2"
    ],
    "relatedPeople": [
      "abraham",
      "elisha",
      "paul"
    ],
    "eraOrder": 8
  },
  {
    "id": "antioch",
    "name": "Antioch of Syria",
    "ancientName": "Ἀντιόχεια",
    "modernName": "Antakya, Turkey",
    "region": "Asia Minor & Greece",
    "coordinates": [
      36.2021,
      36.1606
    ],
    "description": "The \"Cradle of Christian Missions\" on the Orontes River; birthplace of the term \"Christian\", co-pastored by Barnabas and Paul, and launching pad for worldwide missionary journeys.",
    "events": [
      {
        "id": "disciples-called-christians",
        "title": "Disciples First Called Christians at Antioch",
        "era": "Apostles & Early Church",
        "description": "Believers scatter after Stephen's martyrdom and preach to Greeks in Antioch; Barnabas recruits Paul, and disciples are first named \"Christians\" here.",
        "verses": [
          "Acts 11:19-26"
        ],
        "peopleIds": [
          "barnabas",
          "paul"
        ],
        "eraOrder": 8
      },
      {
        "id": "commissioning-first-mission",
        "title": "Holy Spirit Commissions Paul & Barnabas",
        "era": "Apostles & Early Church",
        "description": "While prophets and teachers minister to the Lord and fast, the Holy Spirit commands: \"Separate me Barnabas and Saul for the work whereunto I have called them.\"",
        "verses": [
          "Acts 13:1-3"
        ],
        "peopleIds": [
          "barnabas",
          "paul"
        ],
        "eraOrder": 8
      }
    ],
    "scriptureRefs": [
      "Acts 11:26",
      "Acts 14:26-28",
      "Galatians 2:11"
    ],
    "relatedPeople": [
      "barnabas",
      "paul",
      "peter",
      "silas",
      "luke"
    ],
    "eraOrder": 8
  },
  {
    "id": "tarsus",
    "name": "Tarsus in Cilicia",
    "ancientName": "Ταρσός",
    "modernName": "Tarsus, Mersin Province, Turkey",
    "region": "Asia Minor & Greece",
    "coordinates": [
      36.9167,
      34.895
    ],
    "description": "Distinguished university city and Roman provincial capital; birthplace of Saul (Apostle Paul), granting him inherited Roman citizenship and Greek education.",
    "events": [
      {
        "id": "birthplace-of-paul",
        "title": "Birth and Upbringing of Paul",
        "era": "Apostles & Early Church",
        "description": "Paul was born a citizen of \"no mean city,\" educated in Greek thought and Jewish scripture before moving to Jerusalem to study under Gamaliel.",
        "verses": [
          "Acts 21:39",
          "Acts 22:3"
        ],
        "peopleIds": [
          "paul"
        ],
        "eraOrder": 8
      }
    ],
    "scriptureRefs": [
      "Acts 9:11",
      "Acts 9:30",
      "Acts 21:39"
    ],
    "relatedPeople": [
      "paul"
    ],
    "eraOrder": 8
  },
  {
    "id": "ephesus",
    "name": "Ephesus",
    "ancientName": "Ἔφεσος",
    "modernName": "Selçuk, Izmir Province, Turkey",
    "region": "Asia Minor & Greece",
    "coordinates": [
      37.9497,
      27.3639
    ],
    "description": "Great Greco-Roman commercial metropolis; site of the Temple of Artemis, Paul's three-year revival ministry, Timothy's pastorate, and John's final residence.",
    "events": [
      {
        "id": "paul-three-years-ephesus",
        "title": "Paul's Great Revival & Riot in the Theater",
        "era": "Apostles & Early Church",
        "description": "Paul teaches daily in the School of Tyrannus for two years; handkerchiefs heal diseases, sorcerers burn occult scrolls, and silversmiths riot over Artemis idols.",
        "verses": [
          "Acts 19:1-41"
        ],
        "peopleIds": [
          "paul",
          "timothy",
          "aquila",
          "priscilla"
        ],
        "eraOrder": 8
      },
      {
        "id": "john-revelation-first-letter",
        "title": "Christ's Message to the Church in Ephesus",
        "era": "Apostles & Early Church",
        "description": "Jesus commands John to write to the church in Ephesus, commending their endurance and discernment, yet warning that they have abandoned their first love.",
        "verses": [
          "Revelation 2:1-7"
        ],
        "peopleIds": [
          "john-apostle"
        ],
        "eraOrder": 8
      }
    ],
    "scriptureRefs": [
      "1 Corinthians 16:8",
      "Ephesians 1:1",
      "1 Timothy 1:3"
    ],
    "relatedPeople": [
      "paul",
      "timothy",
      "john-apostle",
      "apollos",
      "aquila",
      "priscilla"
    ],
    "eraOrder": 8
  },
  {
    "id": "philippi",
    "name": "Philippi",
    "ancientName": "Φίλιπποι",
    "modernName": "Krinides, Kavala, Greece",
    "region": "Asia Minor & Greece",
    "coordinates": [
      41.0131,
      24.2858
    ],
    "description": "First city in Europe evangelized by the Apostle Paul following the Macedonian Call vision; site of the conversion of Lydia and the miraculous jailbreak at midnight.",
    "events": [
      {
        "id": "lydia-conversion",
        "title": "Conversion of Lydia at the River",
        "era": "Apostles & Early Church",
        "description": "Paul speaks to women gathered by the river outside the gate on the Sabbath; the Lord opens the heart of Lydia, a seller of purple fabric, to believe.",
        "verses": [
          "Acts 16:13-15"
        ],
        "peopleIds": [
          "paul",
          "silas",
          "luke"
        ],
        "eraOrder": 8
      },
      {
        "id": "midnight-jailbreak",
        "title": "Earthquake and Conversion of the Philippian Jailer",
        "era": "Apostles & Early Church",
        "description": "Beaten and placed in stocks, Paul and Silas sing hymns at midnight; a great earthquake shakes the foundations, and the trembling jailer is saved: \"Believe on the Lord Jesus Christ.\"",
        "verses": [
          "Acts 16:22-34"
        ],
        "peopleIds": [
          "paul",
          "silas"
        ],
        "eraOrder": 8
      }
    ],
    "scriptureRefs": [
      "Philippians 1:1",
      "Philippians 4:15-16",
      "1 Thessalonians 2:2"
    ],
    "relatedPeople": [
      "paul",
      "silas",
      "timothy",
      "luke"
    ],
    "eraOrder": 8
  },
  {
    "id": "athens",
    "name": "Athens",
    "ancientName": "Ἀθῆναι",
    "modernName": "Athens, Greece",
    "region": "Asia Minor & Greece",
    "coordinates": [
      37.9715,
      23.7267
    ],
    "description": "Intellectual capital of the ancient Hellenic world; site of Paul's famous sermon on Mars Hill (the Areopagus) concerning the \"Unknown God.\"",
    "events": [
      {
        "id": "paul-areopagus-sermon",
        "title": "Paul's Sermon on the Areopagus (Mars Hill)",
        "era": "Apostles & Early Church",
        "description": "Provoked by the city's idols, Paul debates Epicurean and Stoic philosophers, declaring that the God who made the world does not dwell in temples made with hands and has raised Jesus from the dead.",
        "verses": [
          "Acts 17:16-34"
        ],
        "peopleIds": [
          "paul"
        ],
        "eraOrder": 8
      }
    ],
    "scriptureRefs": [
      "Acts 17:15",
      "1 Thessalonians 3:1"
    ],
    "relatedPeople": [
      "paul"
    ],
    "eraOrder": 8
  },
  {
    "id": "corinth",
    "name": "Corinth",
    "ancientName": "Κόρινθος",
    "modernName": "Ancient Corinth, Peloponnese, Greece",
    "region": "Asia Minor & Greece",
    "coordinates": [
      37.9056,
      22.8797
    ],
    "description": "Wealthy, cosmopolitan maritime hub connecting the Aegean and Ionian seas; Paul spent eighteen months planting the Corinthian church here with Priscilla and Aquila.",
    "events": [
      {
        "id": "paul-corinth-church-plant",
        "title": "Paul Plants the Church in Corinth",
        "era": "Apostles & Early Church",
        "description": "Paul lodges with Aquila and Priscilla making tents; the Lord reassures him in a vision: \"Be not afraid, but speak... for I have much people in this city.\"",
        "verses": [
          "Acts 18:1-18"
        ],
        "peopleIds": [
          "paul",
          "aquila",
          "priscilla",
          "silas",
          "timothy"
        ],
        "eraOrder": 8
      }
    ],
    "scriptureRefs": [
      "1 Corinthians 1:2",
      "2 Corinthians 1:1",
      "2 Timothy 4:20"
    ],
    "relatedPeople": [
      "paul",
      "aquila",
      "priscilla",
      "apollos",
      "titus"
    ],
    "eraOrder": 8
  },
  {
    "id": "patmos",
    "name": "Isle of Patmos",
    "ancientName": "Πάτμος",
    "modernName": "Patmos, Dodecanese, Greece",
    "region": "Asia Minor & Greece",
    "coordinates": [
      37.3117,
      26.5478
    ],
    "description": "Rugged Aegean penal island where the Apostle John was exiled for the word of God and where he received the apocalyptic visions of the Book of Revelation.",
    "events": [
      {
        "id": "john-revelation-vision",
        "title": "John Receives the Apocalypse of Jesus Christ",
        "era": "Apostles & Early Church",
        "description": "John is \"in the Spirit on the Lord's day\" and hears a loud voice like a trumpet; turning, he beholds the glorified Son of Man holding the keys of death and Hades.",
        "verses": [
          "Revelation 1:9-20",
          "Revelation 4:1-2",
          "Revelation 21:1-4"
        ],
        "peopleIds": [
          "john-apostle"
        ],
        "eraOrder": 8
      }
    ],
    "scriptureRefs": [
      "Revelation 1:9"
    ],
    "relatedPeople": [
      "john-apostle"
    ],
    "eraOrder": 8
  },
  {
    "id": "rome",
    "name": "Rome",
    "ancientName": "Ῥώμη / Roma",
    "modernName": "Rome, Italy",
    "region": "Roman Empire",
    "coordinates": [
      41.9028,
      12.4964
    ],
    "description": "Capital of the Roman Empire and destination of Paul's appeal to Caesar; site of Paul's house arrest, apostolic writings, and the martyrdoms of both Peter and Paul.",
    "events": [
      {
        "id": "paul-arrives-in-rome",
        "title": "Paul Arrives in Rome Under House Arrest",
        "era": "Apostles & Early Church",
        "description": "Surviving shipwreck at Malta, Paul reaches Rome and lives two full years in his own rented house, boldly preaching the Kingdom of God to all who visit without hindrance.",
        "verses": [
          "Acts 28:16-31",
          "Philippians 1:12-14"
        ],
        "peopleIds": [
          "paul",
          "luke"
        ],
        "eraOrder": 8
      },
      {
        "id": "paul-final-charge-martyrdom",
        "title": "Paul's Final Testimony in Roman Prison",
        "era": "Apostles & Early Church",
        "description": "Writing his final letter from a cold Roman dungeon to Timothy: \"I have fought a good fight, I have finished my course, I have kept the faith.\"",
        "verses": [
          "2 Timothy 4:6-8",
          "2 Timothy 4:16-18"
        ],
        "peopleIds": [
          "paul",
          "luke"
        ],
        "eraOrder": 8
      }
    ],
    "scriptureRefs": [
      "Romans 1:7",
      "Acts 19:21",
      "Acts 28:14",
      "2 Timothy 1:17"
    ],
    "relatedPeople": [
      "paul",
      "peter",
      "luke",
      "mark",
      "timothy",
      "aquila",
      "priscilla"
    ],
    "eraOrder": 8
  }
];
