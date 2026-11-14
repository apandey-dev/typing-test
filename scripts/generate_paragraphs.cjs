/**
 * Deterministic generation and validation script for 100 original English paragraphs.
 * Written directly by Antigravity assistant for production V1 launch.
 * Zero external AI API calls. Zero lorem ipsum. 100% original content.
 */

const fs = require('fs');
const path = require('path');

const rawParagraphs = [
  // ==========================================
  // TOPIC 1: TECHNOLOGY (12 paragraphs)
  // 3 Beginner, 4 Intermediate, 3 Advanced, 2 Expert
  // ==========================================
  {
    id: "tech-001",
    topic: "technology",
    difficulty: "beginner",
    recommendedDuration: 60,
    content: "Modern computer keyboards use small electronic switches beneath each keycap. When you press a letter, the circuit closes and sends an electrical signal to the processor. Good posture and keeping your wrists straight helps you type faster without tiring your hands."
  },
  {
    id: "tech-002",
    topic: "technology",
    difficulty: "beginner",
    recommendedDuration: 60,
    content: "Touchscreen smartphones completely transformed modern personal communication. Instead of physical buttons, capacitive glass displays sense tiny electrical charges from human fingers. Users can tap, swipe, and pinch to navigate digital documents, photographs, and web pages with ease."
  },
  {
    id: "tech-003",
    topic: "technology",
    difficulty: "beginner",
    recommendedDuration: 60,
    content: "Cloud storage services allow people to store files on remote internet servers rather than local hardware. Files synchronize automatically across mobile phones, laptops, and tablets. This makes sharing work documents and family photographs remarkably simple and safe against accidental disk failures."
  },
  {
    id: "tech-004",
    topic: "technology",
    difficulty: "intermediate",
    recommendedDuration: 90,
    content: "Open source software development relies on public collaboration among software engineers worldwide. Programmers inspect code repositories, identify software bugs, and submit pull requests to improve shared libraries. Transparency in source code fosters communal trust, accelerates technical innovation, and provides robust foundations for commercial operating systems and web browsers."
  },
  {
    id: "tech-005",
    topic: "technology",
    difficulty: "intermediate",
    recommendedDuration: 90,
    content: "Maintaining proper digital security hygiene is essential for personal privacy online. Users should create unique, high-entropy passwords for critical services and avoid reusing credentials across multiple websites. Enabling hardware-based two-factor authentication provides an indispensable secondary barrier against credential theft and unauthorized server access attempts."
  },
  {
    id: "tech-006",
    topic: "technology",
    difficulty: "intermediate",
    recommendedDuration: 120,
    content: "Responsive web design allows single application interfaces to render fluidly across diverse screen resolutions. Using flexible grid layouts, scalable vector graphics, and CSS media queries, web interfaces dynamically adjust element padding and typography hierarchy. This guarantees seamless reading experiences whether visitors browse from compact handheld smartphones or widescreen workstation monitors."
  },
  {
    id: "tech-007",
    topic: "technology",
    difficulty: "intermediate",
    recommendedDuration: 120,
    content: "Intercontinental internet connectivity relies on thousands of miles of armored fiber optic cables resting on the ocean floor. These submarine cables transmit dense pulses of laser light through flexible silica glass fibers no thicker than human hair. Optical repeaters spaced along deep sea trenches amplify signals across oceanic divides with negligible packet latency."
  },
  {
    id: "tech-008",
    topic: "technology",
    difficulty: "advanced",
    recommendedDuration: 180,
    content: "Modern distributed systems embrace horizontal scaling and partition tolerance to survive unexpected server failures. Engineers design stateless microservices that communicate through asynchronous message queues, ensuring that temporary network partitions do not cascade into catastrophic global outages. Database consistency models often balance strong ACID guarantees against low-latency eventual consistency across geographically replicated clusters."
  },
  {
    id: "tech-009",
    topic: "technology",
    difficulty: "advanced",
    recommendedDuration: 180,
    content: "Asymmetric public key cryptography secures confidential data exchange across untrusted networks through trapdoor mathematical functions. Communication protocols generate complementary key pairs where ciphertext encrypted with a public exponent can only be decrypted by the corresponding private key. During an initial TLS handshake, digital certificates validate cryptographic identities before establishing ephemeral symmetric session keys."
  },
  {
    id: "tech-010",
    topic: "technology",
    difficulty: "advanced",
    recommendedDuration: 180,
    content: "Semiconductor fabrication facilities push the thermodynamic boundaries of physics by printing billions of nanometer transistors onto ultra-pure monocrystalline silicon wafers. Extreme ultraviolet lithography systems focus short wavelength radiation through elaborate reflective mirrors inside high-vacuum chambers to pattern microscopic circuitry. As physical gate oxide scaling approaches atomic limits, chip designers transition toward three-dimensional gate architectures."
  },
  {
    id: "tech-011",
    topic: "technology",
    difficulty: "expert",
    recommendedDuration: 300,
    content: "Systems programming languages emphasize deterministic memory allocation, zero-cost abstractions, and memory safety without relying on non-deterministic garbage collection runtimes. Compilers enforce strict ownership semantics and borrow checking algorithms at compile time, eliminating null pointer dereferencing, buffer overflows, and multi-threaded data races. Concurrent architectures utilize lock-free atomic compare-and-swap primitives and processor cache coherence protocols to maximize throughput across symmetric multiprocessing hardware."
  },
  {
    id: "tech-012",
    topic: "technology",
    difficulty: "expert",
    recommendedDuration: 300,
    content: "Optimizing compiler pipelines transform high-level declarative syntax trees into highly vectorized machine assembly through multiple Intermediate Representation passes. Static single assignment form enables dead code elimination, loop invariant code motion, common subexpression elimination, and aggressive function inlining. During target backend code generation, graph coloring register allocation algorithms map unlimited virtual variables onto scarce physical hardware registers while minimizing spill operations to main system memory."
  },

  // ==========================================
  // TOPIC 2: SCIENCE (10 paragraphs)
  // 2 Beginner, 3 Intermediate, 3 Advanced, 2 Expert
  // ==========================================
  {
    id: "sci-001",
    topic: "science",
    difficulty: "beginner",
    recommendedDuration: 60,
    content: "The water cycle moves fresh moisture continuously around our planet. Warm sunshine heats water in oceans and lakes, causing it to evaporate into invisible vapor. As the vapor rises into cool air, it condenses into fluffy clouds before falling back to earth as rain or snow."
  },
  {
    id: "sci-002",
    topic: "science",
    difficulty: "beginner",
    recommendedDuration: 60,
    content: "Green plants produce their own food through photosynthesis using sunlight, water, and atmospheric carbon dioxide. Specialized chlorophyll pigments inside microscopic leaf cells absorb light wavelengths and release pure oxygen back into the atmosphere. This biological process sustains almost all animal life on Earth."
  },
  {
    id: "sci-003",
    topic: "science",
    difficulty: "intermediate",
    recommendedDuration: 90,
    content: "Plate tectonics describes how immense slabs of Earth's solid crust float atop the semi-fluid asthenosphere. Convection currents within the molten mantle slowly drive continental plates together, tear them apart, or grind them horizontally against adjacent boundaries. These slow geologic motions push up towering mountain chains, crack volcanic rifts, and trigger sudden earthquakes."
  },
  {
    id: "sci-004",
    topic: "science",
    difficulty: "intermediate",
    recommendedDuration: 90,
    content: "Deoxyribonucleic acid carries the hereditary blueprint for every known biological organism. Its double helix structure resembles a twisted ladder composed of alternating sugar-phosphate backbones connected by four complementary nitrogenous bases. Specific sequences of adenine, thymine, cytosine, and guanine encode the precise amino acid orders needed to synthesize functional cellular proteins."
  },
  {
    id: "sci-005",
    topic: "science",
    difficulty: "intermediate",
    recommendedDuration: 120,
    content: "The fundamental laws of thermodynamics govern energy transformations across all physical and chemical processes. The first law dictates that total energy in an isolated system remains constant, changing forms but never being created or destroyed. The second law establishes that entropy increases over time, meaning thermal energy naturally disperses toward disorder unless external work is applied."
  },
  {
    id: "sci-006",
    topic: "science",
    difficulty: "advanced",
    recommendedDuration: 180,
    content: "Quantum mechanics reveals that physical entities exhibit both particle-like and wave-like characteristics depending on experimental observation. Elementary particles like electrons occupy probabilistic wave functions described by the Schrödinger equation, existing in linear superpositions of multiple states simultaneously. When a definitive measurement interacts with the quantum system, the wave function collapses into a singular deterministic observable value."
  },
  {
    id: "sci-007",
    topic: "science",
    difficulty: "advanced",
    recommendedDuration: 180,
    content: "Cellular respiration converts biochemical energy from nutrient molecules into adenosine triphosphate within eukaryotic mitochondria. During the Krebs cycle and oxidative phosphorylation, electrons stripped from glucose metabolites traverse transmembrane protein complexes, pumping protons across the inner mitochondrial membrane. This electrochemical proton gradient drives ATP synthase motors, powering metabolic reactions essential for cellular survival."
  },
  {
    id: "sci-008",
    topic: "science",
    difficulty: "advanced",
    recommendedDuration: 180,
    content: "Einstein's general theory of relativity fundamentally reimagined gravity not as an invisible mechanical force, but as the geometric curvature of four-dimensional spacetime. Massive astronomical bodies warp the fabric of spacetime around them, causing traveling light rays and orbiting celestial bodies to follow geodesic trajectories. Gravitational time dilation dictates that atomic clocks tick marginally slower in stronger gravitational potentials."
  },
  {
    id: "sci-009",
    topic: "science",
    difficulty: "expert",
    recommendedDuration: 300,
    content: "CRISPR-Cas9 endonuclease complexes provide precise molecular editing capabilities by utilizing synthetic single-guide RNA sequences to locate target genomic loci. Upon identifying a matching protospacer adjacent motif, the Cas9 enzyme introduces site-specific double-strand breaks in the double-stranded DNA helix. Cellular repair mechanisms then resolve these lesions through non-homologous end joining or homology-directed repair, enabling targeted gene knockouts, precise single-nucleotide base edits, and epigenetic modifications in living eukaryotic organisms."
  },
  {
    id: "sci-010",
    topic: "science",
    difficulty: "expert",
    recommendedDuration: 300,
    content: "The Standard Model of particle physics classifies all known elementary constituents of matter into fundamental quarks and leptons interacting via gauge vector bosons. Spontaneous electroweak symmetry breaking via the Brout-Englert-Higgs mechanism endows massive gauge bosons and chiral fermions with rest mass through Yukawa couplings to the scalar Higgs field vacuum expectation value. Despite its extraordinary predictive accuracy across quantum electrodynamics and chromodynamics, the framework leaves neutrino mass oscillations, baryogenesis asymmetry, and dark matter unresolved."
  },

  // ==========================================
  // TOPIC 3: HISTORY (10 paragraphs)
  // 2 Beginner, 3 Intermediate, 3 Advanced, 2 Expert
  // ==========================================
  {
    id: "hist-001",
    topic: "history",
    difficulty: "beginner",
    recommendedDuration: 60,
    content: "The invention of the wheel in ancient Mesopotamia marked a turning point in human civilization. Early potters first used circular turntables to shape clay vessels. Soon, innovators attached wooden wheels to heavy carts, transforming transportation, agricultural harvesting, and trade between early cities."
  },
  {
    id: "hist-002",
    topic: "history",
    difficulty: "beginner",
    recommendedDuration: 60,
    content: "The Great Wall of China represents one of humanity's most ambitious defensive architectural undertakings. Built across rolling northern mountain ridges over many dynasties, the stone fortifications protected agricultural communities, regulated frontier trade, and provided early warning signal towers against nomadic cavalry incursions."
  },
  {
    id: "hist-003",
    topic: "history",
    difficulty: "intermediate",
    recommendedDuration: 90,
    content: "The historic Silk Road formed an intricate network of overland caravan routes linking Chinese imperial capitals to Mediterranean seaports. Merchants traversed harsh desert basins and treacherous mountain passes, transporting high-value silk, aromatic spices, glassware, and porcelain. Alongside physical merchandise, travelers exchanged philosophical ideas, medical manuscripts, architectural techniques, and religious traditions across ancient civilizations."
  },
  {
    id: "hist-004",
    topic: "history",
    difficulty: "intermediate",
    recommendedDuration: 90,
    content: "The Royal Library of Alexandria was an intellectual epicenter of the Hellenistic world, seeking to collect comprehensive knowledge across sciences and humanities. Scribes systematically copied maritime charts, mathematical proofs, and epic poetry gathered from ships docking in Egyptian harbors. Scholars debated astronomy, geometry, and linguistic grammar within its halls before political conflict dispersed its irreplaceable manuscript scrolls."
  },
  {
    id: "hist-005",
    topic: "history",
    difficulty: "intermediate",
    recommendedDuration: 120,
    content: "The eighteenth-century Industrial Revolution shifted agrarian manual labor into mechanized manufacturing powered by coal and steam engines. Inventors created automated textile spinning frames and steam locomotives, dramatically shrinking transit times between inland mining centers and coastal industrial ports. This sweeping economic transformation stimulated rapid urban migration, altered social hierarchies, and laid the foundations of modern consumer economies."
  },
  {
    id: "hist-006",
    topic: "history",
    difficulty: "advanced",
    recommendedDuration: 180,
    content: "The Renaissance ignited a profound cultural rebirth across Italian city-states through the revival of classical antiquity, humanism, and empirical observation. Florentine artists mastered mathematical linear perspective and anatomical realism, while scholars recovered forgotten Greek and Roman philosophical manuscripts. Patrons like the Medici family funded monumental cathedral architecture and scientific investigations, bridging medieval scholasticism toward early modern scientific curiosity."
  },
  {
    id: "hist-007",
    topic: "history",
    difficulty: "advanced",
    recommendedDuration: 180,
    content: "During the height of the Roman Empire, a prolonged era of civic stability known as the Pax Romana facilitated commercial prosperity and cultural integration across Mediterranean provinces. Roman engineers constructed thousands of miles of durable paved highways, defensive frontier ramparts, and stone aqueducts delivering clean mountain water into urban fountains and public baths. Codified Roman jurisprudence provided a cohesive legal framework that influenced modern Western legal constitutions."
  },
  {
    id: "hist-008",
    topic: "history",
    difficulty: "advanced",
    recommendedDuration: 180,
    content: "The Age of Discovery in the fifteenth century transformed global geography through revolutionary maritime navigation and exploratory expeditions. European shipbuilders engineered nimble caravels equipped with lateen sails and sternpost rudders, allowing captains to sail against prevailing headwinds into previously uncharted oceans. Using navigational astrolabes, magnetic compasses, and astronomical ephemerides, navigators circumnavigated continents and triggered transatlantic Columbian exchanges."
  },
  {
    id: "hist-009",
    topic: "history",
    difficulty: "expert",
    recommendedDuration: 300,
    content: "The catastrophic Late Bronze Age collapse around twelve hundred BCE precipitated the abrupt unraveling of interconnected Mediterranean imperial hegemonies including the Mycenaean kingdoms, the Hittite Empire, and the New Kingdom of Egypt. Archaeologists attribute this synchronized civilizational fracture to complex systems collapse driven by multi-decadal megadroughts, agricultural harvest failures, disrupted international tin trading networks, and violent incursions by migratory Sea Peoples. The subsequent socioeconomic disintegration severed palatial redistribution economies, extinguished early syllabic writing traditions, and plunged the region into centuries of decentralization."
  },
  {
    id: "hist-010",
    topic: "history",
    difficulty: "expert",
    recommendedDuration: 300,
    content: "The European Enlightenment challenged feudal absolutism and ecclesiastical dogma through rationalist epistemologies and social contract theory. Thinkers like John Locke, Voltaire, and Jean-Jacques Rousseau argued that legitimate political governance derives authority exclusively from the consent of the governed to protect inalienable natural rights. Baron de Montesquieu's conceptualization of tripartite separation of powers between legislative, executive, and judicial branches directly influenced constitutional drafting during the American and French democratic revolutions."
  },

  // ==========================================
  // TOPIC 4: GEOGRAPHY (8 paragraphs)
  // 2 Beginner, 3 Intermediate, 2 Advanced, 1 Expert
  // ==========================================
  {
    id: "geo-001",
    topic: "geography",
    difficulty: "beginner",
    recommendedDuration: 60,
    content: "The Amazon Basin contains the largest tropical rainforest on our planet, spreading across nine South American nations. The mighty Amazon River flows eastward toward the Atlantic Ocean, carrying more freshwater volume than any other river system on Earth. Millions of rare wildlife species inhabit its dense green canopies."
  },
  {
    id: "geo-002",
    topic: "geography",
    difficulty: "beginner",
    recommendedDuration: 60,
    content: "The Sahara Desert covers almost all of North Africa, creating an expansive landscape of shifting sand dunes, arid gravel plateaus, and dry mountain peaks. Rainfall is scarce, yet isolated oases fed by deep underground aquifers support thriving palm groves and historic nomadic caravan routes."
  },
  {
    id: "geo-003",
    topic: "geography",
    difficulty: "intermediate",
    recommendedDuration: 90,
    content: "The Pacific Ring of Fire is a horseshoe-shaped geological boundary encircling the Pacific Ocean basin. Marked by continuous tectonic subduction zones, oceanic trenches, and volcanic arcs, this dynamic region accounts for the majority of the world's most severe earthquakes and active volcanoes. Populations living along its coastlines construct specialized earthquake-resistant buildings and maintain tsunami warning sirens."
  },
  {
    id: "geo-004",
    topic: "geography",
    difficulty: "intermediate",
    recommendedDuration: 90,
    content: "The towering Himalayan mountain range formed from the ongoing continental collision between the Indian and Eurasian tectonic plates. Rising thousands of meters above sea level, these majestic peaks include Mount Everest, the highest elevation on Earth. Glaciers within the Himalayas supply vital freshwater headwaters for major river systems that sustain billions of people downstream across South Asia."
  },
  {
    id: "geo-005",
    topic: "geography",
    difficulty: "intermediate",
    recommendedDuration: 120,
    content: "The Nile River flows northward through eleven African countries before emptying into the Mediterranean Sea via an expansive agricultural delta. For thousands of years, seasonal river floods deposited dark, mineral-rich silt onto arid desert floodplains, providing dependable irrigation for ancient Egyptian farmers. Modern dams along the river now generate significant hydroelectric power and provide regulated water reservoirs throughout droughts."
  },
  {
    id: "geo-006",
    topic: "geography",
    difficulty: "advanced",
    recommendedDuration: 180,
    content: "Glacial geomorphology shapes dramatic high-latitude coastlines through the relentless abrasive power of moving continental ice sheets. As massive alpine glaciers advance through pre-existing river valleys, their immense mass plucks bedrock and carves deep, steep-sided U-shaped troughs. Following climatic warming and glacial retreat, rising sea levels flood these over-deepened chasms, producing majestic, tranquil maritime fjords surrounded by towering vertical cliffs."
  },
  {
    id: "geo-007",
    topic: "geography",
    difficulty: "advanced",
    recommendedDuration: 180,
    content: "Thermohaline circulation operates as an immense global oceanic conveyor belt driven by differences in water temperature and salinity gradients. In polar North Atlantic latitudes, sea ice formation leaves residual surface waters colder and denser with high salt concentrations, forcing water masses to plunge into abyssal ocean depths. This deep water slowly circulates through global ocean basins before upwelling thousands of miles away, distributing thermal energy."
  },
  {
    id: "geo-008",
    topic: "geography",
    difficulty: "expert",
    recommendedDuration: 300,
    content: "Karst geomorphological landscapes develop primarily through the prolonged chemical dissolution of soluble carbonate lithologies such as limestone, dolomite, and gypsum by mildly acidic groundwater. Atmospheric carbon dioxide dissolves into percolating precipitation, synthesizing weak carbonic acid that progressively enlarges subterranean fractures, bedding planes, and joint networks over geological epochs. This progressive geochemical leaching culminates in complex subterranean drainage systems, extensive speleothem cave networks, sinking streams, poljes, and dramatic surface collapse dolines."
  },

  // ==========================================
  // TOPIC 5: NATURE AND ENVIRONMENT (10 paragraphs)
  // 2 Beginner, 3 Intermediate, 3 Advanced, 2 Expert
  // ==========================================
  {
    id: "nat-001",
    topic: "nature and environment",
    difficulty: "beginner",
    recommendedDuration: 60,
    content: "Honeybees play an essential role in pollinating agricultural crops, wild flowers, and fruit orchards. As worker bees collect sweet nectar to produce honey inside their geometric wax hives, fine pollen grains cling to their fuzzy bodies and transfer between blossoms, helping plants reproduce and yield bountiful harvests."
  },
  {
    id: "nat-002",
    topic: "nature and environment",
    difficulty: "beginner",
    recommendedDuration: 60,
    content: "Every autumn, millions of vibrant orange monarch butterflies embark on an extraordinary two-thousand-mile migration across North America to winter sanctuaries in Mexican pine forests. Guided by environmental cues and the sun's position, these delicate insects demonstrate one of the natural world's most resilient instinctual journeys."
  },
  {
    id: "nat-003",
    topic: "nature and environment",
    difficulty: "intermediate",
    recommendedDuration: 90,
    content: "Tropical coral reefs shelter extraordinary marine biodiversity despite occupying less than one percent of the ocean floor. Tiny coral polyps build calcium carbonate exoskeletons that form intricate living underwater structures supporting thousands of fish, crustacean, and sea turtle species. These vibrant barrier reefs also dissipate powerful ocean storm waves, safeguarding fragile coastlines from severe coastal erosion."
  },
  {
    id: "nat-004",
    topic: "nature and environment",
    difficulty: "intermediate",
    recommendedDuration: 90,
    content: "Deciduous forest floors thrive through subterranean mycorrhizal fungal networks that physically link the root systems of different tree species. These symbiotic fungi absorb soil minerals and water to trade with trees in exchange for photosynthesized sugars. Underground chemical signaling allows neighboring mature trees to allocate carbon resources to shaded saplings during stressful seasonal droughts."
  },
  {
    id: "nat-005",
    topic: "nature and environment",
    difficulty: "intermediate",
    recommendedDuration: 120,
    content: "Wetland marshes act as natural water purification systems, filtering suspended sediments, agricultural fertilizers, and heavy metals from overland runoff before it reaches larger rivers. Dense vegetation slows floodwaters, recharging local subterranean aquifers while preventing downstream urban flooding. In addition to improving water quality, wetlands provide indispensable nesting sanctuaries for migratory waterfowl."
  },
  {
    id: "nat-006",
    topic: "nature and environment",
    difficulty: "advanced",
    recommendedDuration: 180,
    content: "The reintroduction of apex predators into degraded ecosystems can stimulate dramatic top-down trophic cascades that restore ecological equilibrium. When wildlife biologists returned gray wolves to Yellowstone National Park, their predation patterns redistributed grazing elk away from exposed riverbanks. This behavioral shift allowed young willow and aspen groves to regenerate, stabilizing riverbanks, cooling stream waters, and encouraging beaver colonies to build resilient aquatic wetland habitats."
  },
  {
    id: "nat-007",
    topic: "nature and environment",
    difficulty: "advanced",
    recommendedDuration: 180,
    content: "Proliferating plastic waste in marine environments poses severe threats to oceanic food webs through mechanical fragmentation into microscopic particles. Solar ultraviolet radiation and relentless ocean wave action degrade floating consumer plastics into toxic microplastics that marine organisms mistake for nutritious plankton. These synthetic particles bioaccumulate across trophic levels, introducing endocrine-disrupting phthalates into commercial fisheries."
  },
  {
    id: "nat-008",
    topic: "nature and environment",
    difficulty: "advanced",
    recommendedDuration: 180,
    content: "Modern utility-scale wind power harnesses aerodynamic lift across composite turbine blades to generate carbon-free electricity on an industrial scale. Computerized pitch control mechanisms continuously rotate multi-ton turbine nacelles to track ambient wind directions and optimize kinetic energy capture across varying gusts. Integrating variable renewable generation into existing electrical grids demands smart utility monitoring, dynamic frequency regulation, and grid-scale storage."
  },
  {
    id: "nat-009",
    topic: "nature and environment",
    difficulty: "expert",
    recommendedDuration: 300,
    content: "Soil microbiological biodiversity underpins terrestrial carbon cycling through complex biochemical interactions between saprophytic fungal hyphae, bacterial biofilms, and endogeic annelids. Mutualistic rhizobia bacteria colonize legume root nodules to biochemically fix inert atmospheric dinitrogen into bioavailable ammonium via nitrogenase enzyme catalysis. The accumulation of recalcitrant humic macromolecules and glomalin glycoprotein aggregates enhances soil cation exchange capacity, preserves macro-aggregate structural stability, and sequesters gigatons of stable organic carbon away from the atmosphere."
  },
  {
    id: "nat-010",
    topic: "nature and environment",
    difficulty: "expert",
    recommendedDuration: 300,
    content: "Mangrove wetland biomes exhibit specialized halophytic morphological adaptations that enable thriving vegetative growth in hyper-saline intertidal marine environments. Specialized pneumatophore aerial roots and extensive stilt root matrices facilitate atmospheric gas exchange during high tide immersion while attenuating destructive hydrodynamic storm surge energies along fragile tropical shorelines. Furthermore, the anaerobic, waterlogged sediment conditions within mangrove estuaries severely inhibit microbial decomposition, creating immensely dense blue carbon sinks."
  },

  // ==========================================
  // TOPIC 6: EDUCATION (10 paragraphs)
  // 2 Beginner, 3 Intermediate, 3 Advanced, 2 Expert
  // ==========================================
  {
    id: "edu-001",
    topic: "education",
    difficulty: "beginner",
    recommendedDuration: 60,
    content: "Reading books every day expands your personal vocabulary, sharpens memory, and sparks imagination. Whether exploring distant fantasy kingdoms or discovering fascinating historical facts, reading encourages disciplined concentration. Dedicating just twenty quiet minutes each evening builds a lifelong habit of intellectual curiosity and clear creative expression."
  },
  {
    id: "edu-002",
    topic: "education",
    difficulty: "beginner",
    recommendedDuration: 60,
    content: "Practicing mathematics through hands-on logic puzzles and practical word problems builds valuable analytical problem-solving skills. Mathematics teaches students how to break complicated challenges into manageable steps. Learning to balance budgets, measure physical spaces, and calculate percentages gives learners practical confidence in their daily personal decisions."
  },
  {
    id: "edu-003",
    topic: "education",
    difficulty: "intermediate",
    recommendedDuration: 90,
    content: "The Socratic teaching method transforms traditional passive lecture classrooms into dynamic forums of disciplined intellectual inquiry. Rather than simply delivering pre-packaged factual answers, instructors pose probing open-ended questions that challenge learners to examine underlying premises. Students learn to articulate logical rationales, defend viewpoints using verifiable evidence, and respect civil debate."
  },
  {
    id: "edu-004",
    topic: "education",
    difficulty: "intermediate",
    recommendedDuration: 90,
    content: "Collaborative academic projects teach students essential interpersonal teamwork abilities alongside technical mastery. Working within small study groups requires active listening, constructive compromise, and mutual accountability when delegating research duties. These shared problem-solving experiences prepare graduates to collaborate productively across diverse workplace teams and coordinate complex projects."
  },
  {
    id: "edu-005",
    topic: "education",
    difficulty: "intermediate",
    recommendedDuration: 120,
    content: "Modern digital learning platforms have democratized global access to high-caliber collegiate lectures, interactive coding environments, and technical credentials. Students in remote or economically disadvantaged communities can master computer programming, data analysis, and foreign languages through self-paced digital coursework. Online academic forums connect inquisitive learners with international peers, fostering global knowledge exchange."
  },
  {
    id: "edu-006",
    topic: "education",
    difficulty: "advanced",
    recommendedDuration: 180,
    content: "Cognitive load theory posits that human working memory possesses strict bandwidth constraints when processing novel academic information into long-term memory schemas. Instructional designers mitigate extraneous mental load by eliminating redundant multimedia visual stimuli and utilizing dual-channel auditory and visual presentations. Applying spaced repetition algorithms and deliberate active recall retrieval exercises prevents forgetting curves, cementing durable comprehension."
  },
  {
    id: "edu-007",
    topic: "education",
    difficulty: "advanced",
    recommendedDuration: 180,
    content: "Inquiry-based scientific pedagogy encourages students to construct empirical understanding through hands-on laboratory investigation rather than passive textbook memorization. By formulating testable hypotheses, calibrating scientific measurement apparatus, and conducting controlled experiments, learners encounter authentic scientific inquiry firsthand. Analyzing experimental anomalies and calculating statistical uncertainty instills rigorous methodological skepticism and intellectual honesty."
  },
  {
    id: "edu-008",
    topic: "education",
    difficulty: "advanced",
    recommendedDuration: 180,
    content: "Interdisciplinary academic curricula bridge historically compartmentalized scientific fields with humanistic critique to foster holistic critical synthesis. When engineering students examine ethical philosophy, technological designs become more attuned to civic equity and environmental sustainability. Similarly, integrating statistical data literacy into social science coursework empowers students to evaluate public policy arguments using verifiable data."
  },
  {
    id: "edu-009",
    topic: "education",
    difficulty: "expert",
    recommendedDuration: 300,
    content: "Neurobiological research confirms that neuroplastic structural remodeling continues throughout adult lifespan during intensive motor and intellectual skill acquisition. Repetitive deliberate practice stimulates oligodendrocytes to synthesize dense myelin sheaths around actively firing axonal pathways, drastically increasing action potential conduction velocities across cortical networks. This neurological consolidation transforms formerly demanding conscious operations into highly automated, fluent behavioral schemas."
  },
  {
    id: "edu-010",
    topic: "education",
    difficulty: "expert",
    recommendedDuration: 300,
    content: "Metacognitive calibration represents a decisive determinant of high academic performance and self-regulated scholastic independence. Proficient learners continuously monitor their cognitive comprehension during technical reading, employing self-diagnostic questioning heuristics to locate conceptual deficits before testing. Rather than confusing passive familiarity with genuine mastery, self-directed scholars deliberately introduce desirable difficulties, interleaving varied problem typologies to cultivate resilient schemas."
  },

  // ==========================================
  // TOPIC 7: BUSINESS AND ECONOMICS (8 paragraphs)
  // 2 Beginner, 3 Intermediate, 2 Advanced, 1 Expert
  // ==========================================
  {
    id: "biz-001",
    topic: "business and economics",
    difficulty: "beginner",
    recommendedDuration: 60,
    content: "Creating a realistic monthly household budget is the cornerstone of long-term financial security. Tracking your regular expenditures helps you identify unnecessary impulse purchases and build an emergency savings fund. Living within your financial means reduces monetary anxiety and provides peaceful independence for unexpected medical or repair expenses."
  },
  {
    id: "biz-002",
    topic: "business and economics",
    difficulty: "beginner",
    recommendedDuration: 60,
    content: "The law of supply and demand fundamentally determines market prices in competitive economies. When consumer demand for a product increases while supply remains limited, retail prices naturally rise. Conversely, when manufacturers produce abundant surpluses of merchandise, merchants discount prices to encourage shoppers to buy remaining inventory."
  },
  {
    id: "biz-003",
    topic: "business and economics",
    difficulty: "intermediate",
    recommendedDuration: 90,
    content: "Prudent investment strategies emphasize portfolio diversification across uncorrelated asset classes to minimize systemic downside risk. By allocating capital among index funds, corporate bonds, real estate assets, and liquid treasury cash reserves, investors shield their net worth against sudden market downturns. Balanced asset rebalancing locks in gains from outperforming sectors while systematically buying undervalued assets."
  },
  {
    id: "biz-004",
    topic: "business and economics",
    difficulty: "intermediate",
    recommendedDuration: 90,
    content: "Modern e-commerce retail logistics depend upon automated fulfillment distribution centers equipped with autonomous guided sorting vehicles. Warehouse management software organizes inventory by predictive consumer purchasing frequency, minimizing employee transit times across high-volume aisles. Sophisticated logistics tracking systems provide transparent real-time shipping updates from packaging to final residential delivery."
  },
  {
    id: "biz-005",
    topic: "business and economics",
    difficulty: "intermediate",
    recommendedDuration: 120,
    content: "Corporate sustainability initiatives increasingly recognize that reducing energy consumption and minimizing industrial packaging waste directly lowers operational overhead. Forward-thinking companies audit global supply chains to replace single-use plastics with compostable paper materials and source renewable electrical power for manufacturing facilities. Environmental transparency builds consumer brand loyalty and mitigates future regulatory compliance liabilities."
  },
  {
    id: "biz-006",
    topic: "business and economics",
    difficulty: "advanced",
    recommendedDuration: 180,
    content: "Early-stage venture capital financing accelerates disruptive technology startups through structured institutional investment rounds. Founders negotiate term sheets establishing pre-money enterprise valuations, protective liquidation preferences, and board governance seats in exchange for capital injections. Utilizing standardized Simple Agreements for Future Equity allows fledgling enterprises to defer contentious valuation calculations until substantial revenue milestones materialize."
  },
  {
    id: "biz-007",
    topic: "business and economics",
    difficulty: "advanced",
    recommendedDuration: 180,
    content: "Central bank monetary policy committees steer national macroeconomic trajectories by adjusting benchmark policy interest rates and managing balance sheet asset purchases. During overheated inflationary cycles, central bankers implement quantitative tightening and elevate overnight lending rates to moderate domestic credit expansion and consumer borrowing. Conversely, countercyclical rate reductions during recessions stimulate investment liquidity across commercial lending markets."
  },
  {
    id: "biz-008",
    topic: "business and economics",
    difficulty: "expert",
    recommendedDuration: 300,
    content: "Microeconomic market equilibrium reflects the dynamic intersection of consumer marginal utility curves and competitive firm marginal cost functions. When markets deviate from Pareto-efficient outcomes due to negative externalities, asymmetric information, or monopolistic price discrimination, deadweight economic losses diminish consumer welfare. Game-theoretic oligopolistic models like the Nash equilibrium elucidate how competing corporations calibrate pricing strategies in response to competitor output decisions."
  },

  // ==========================================
  // TOPIC 8: SPACE AND ASTRONOMY (8 paragraphs)
  // 2 Beginner, 3 Intermediate, 2 Advanced, 1 Expert
  // ==========================================
  {
    id: "spc-001",
    topic: "space and astronomy",
    difficulty: "beginner",
    recommendedDuration: 60,
    content: "The Moon is Earth's only natural satellite, orbiting our planet approximately every twenty-seven days. Its gravitational pull creates the daily oceanic tides that rise and fall along coastlines worldwide. Through a backyard telescope, observers can clearly see rugged lunar impact craters and dark volcanic basalt plains."
  },
  {
    id: "spc-002",
    topic: "space and astronomy",
    difficulty: "beginner",
    recommendedDuration: 60,
    content: "Mars has long captivated astronomers with its reddish iron-rich soil, massive extinct volcanoes, and polar ice caps composed of water and frozen carbon dioxide. Robotic rovers exploring its rocky surface have uncovered dried riverbeds and mineral deposits, proving that liquid water once flowed across ancient Martian landscapes."
  },
  {
    id: "spc-003",
    topic: "space and astronomy",
    difficulty: "intermediate",
    recommendedDuration: 90,
    content: "The vast asteroid belt occupies a wide orbital region between the inner rocky planets and the outer gas giants. Containing millions of irregularly shaped metallic and rocky remnants from the early solar system, its largest body is the dwarf planet Ceres. Despite dramatic depictions in popular science fiction films, astronomical distances between individual asteroids are millions of miles apart."
  },
  {
    id: "spc-004",
    topic: "space and astronomy",
    difficulty: "intermediate",
    recommendedDuration: 90,
    content: "Comets are icy celestial wanderers composed of frozen volatile gases, cosmic dust, and organic carbon compounds originating from the distant Oort cloud. When a comet's eccentric elliptical orbit draws it near the radiant heat of the Sun, frozen ices sublimate into gaseous atmospheres. Solar radiation pressure and solar winds push these ionized particles into brilliant glowing tails."
  },
  {
    id: "spc-005",
    topic: "space and astronomy",
    difficulty: "intermediate",
    recommendedDuration: 120,
    content: "Orbiting space telescopes positioned outside Earth's turbulent atmosphere capture crisp, unblurred deep-space imagery across electromagnetic spectrums. Equipped with specialized infrared detectors, modern space observatories peer through obscuring interstellar dust clouds to witness the birth of stars within stellar nurseries. Their sensitive spectroscopy instruments analyze the atmospheric chemistry of distant exoplanets for water vapor."
  },
  {
    id: "spc-006",
    topic: "space and astronomy",
    difficulty: "advanced",
    recommendedDuration: 180,
    content: "Exoplanetary detection techniques have revolutionized modern astrophysics by discovering thousands of worlds orbiting alien stars across the Milky Way galaxy. The transit photometry method measures minuscule periodic dimming in a host star's brightness when an orbiting planet traverses the stellar disk from Earth's line of sight. Complementary radial velocity measurements detect Doppler shifts in stellar spectral lines caused by gravitational wobbles."
  },
  {
    id: "spc-007",
    topic: "space and astronomy",
    difficulty: "advanced",
    recommendedDuration: 180,
    content: "Supermassive black holes residing at galactic nuclei exert titanic gravitational fields that anchor billions of revolving stars into organized spiral structures. As surrounding interstellar gas and stellar debris fall toward the event horizon, frictional shear forces heat the relativistic accretion disk to millions of degrees, releasing luminous synchrotron radiation. In extreme active galactic nuclei, twisted magnetic fields channel relativistic plasma jets into intergalactic voids."
  },
  {
    id: "spc-008",
    topic: "space and astronomy",
    difficulty: "expert",
    recommendedDuration: 300,
    content: "Observational cosmology utilizes the cosmic microwave background radiation as an authentic relic imprint of the infant universe approximately three hundred and eighty thousand years following the Big Bang. Precise satellite radiometers measure infinitesimal temperature anisotropies across the microwave sky that reflect primordial quantum fluctuations expanded exponentially during inflationary epochs. Analyzing angular power spectrum multipoles constrains fundamental cosmological parameters including cold dark matter density, the Hubble expansion constant, and dark energy equations of state."
  },

  // ==========================================
  // TOPIC 9: EVERYDAY LIFE (8 paragraphs)
  // 3 Beginner, 3 Intermediate, 2 Advanced, 0 Expert
  // ==========================================
  {
    id: "life-001",
    topic: "everyday life",
    difficulty: "beginner",
    recommendedDuration: 60,
    content: "Cooking wholesome meals from scratch at home brings families together around the dinner table. Chopping fresh vegetables, simmering savory sauces, and sharing homemade dishes fosters heartwarming memories. Preparing your own food gives you control over healthy ingredients and provides a relaxing, creative hobby after a long day at work."
  },
  {
    id: "life-002",
    topic: "everyday life",
    difficulty: "beginner",
    recommendedDuration: 60,
    content: "Taking a brisk morning walk through neighborhood parks refreshes the spirit and prepares your mind for daily responsibilities. Breathing crisp morning air, listening to birds chirping in tall trees, and greeting friendly neighbors provides gentle physical exercise that boosts mood and sets a calm, positive tone for the day."
  },
  {
    id: "life-003",
    topic: "everyday life",
    difficulty: "beginner",
    recommendedDuration: 60,
    content: "Maintaining a clean and tidy workspace significantly reduces mental stress and improves concentration on demanding tasks. When desks are clear of clutter, papers organized into labeled folders, and supplies kept in assigned drawers, individuals can focus completely on creative work without unnecessary visual distractions."
  },
  {
    id: "life-004",
    topic: "everyday life",
    difficulty: "intermediate",
    recommendedDuration: 90,
    content: "Establishing an unvarying nightly sleep schedule supports natural circadian rhythm synchronization and bolsters cognitive immune function. Avoiding bright blue-light electronic displays for an hour before bedtime allows the brain to naturally synthesize melatonin, signaling that it is time to rest. Consistent eight-hour restorative sleep cycles enhance memory consolidation, regulate mood stability, and improve daytime problem-solving performance."
  },
  {
    id: "life-005",
    topic: "everyday life",
    difficulty: "intermediate",
    recommendedDuration: 90,
    content: "Mindful hydration and balanced nutrition provide sustained physical energy throughout hectic professional workdays. Drinking clean water regularly prevents fatigue and headaches often mistaken for hunger pangs. Pairing complex whole grains with lean proteins and vibrant seasonal vegetables maintains stable blood glucose levels, avoiding the sudden afternoon energy crashes that accompany processed sugary snacks."
  },
  {
    id: "life-006",
    topic: "everyday life",
    difficulty: "intermediate",
    recommendedDuration: 120,
    content: "Practicing gratitude through daily evening journaling fosters emotional resilience and broadens perspective during challenging life transitions. Taking five minutes before sleep to write down specific blessings, acts of kindness, or personal accomplishments shifts mental focus away from chronic worries. Over time, this reflective psychological practice cultivates optimism, strengthens empathy in personal relationships, and deepens life satisfaction."
  },
  {
    id: "life-007",
    topic: "everyday life",
    difficulty: "advanced",
    recommendedDuration: 180,
    content: "Effective personal time management requires ruthless prioritization of high-leverage activities using deliberate cognitive frameworks like the Eisenhower Decision Matrix. Distinguishing urgent tasks from genuinely important long-term objectives prevents professionals from becoming trapped in reactive administrative firefighting. Allocating uninterrupted ninety-minute deep work blocks to strategic creative goals ensures meaningful progress toward ambitious life aspirations."
  },
  {
    id: "life-008",
    topic: "everyday life",
    difficulty: "advanced",
    recommendedDuration: 180,
    content: "Cultivating intentional digital minimalism protects intellectual focus and emotional tranquility amid an ecosystem designed for perpetual distraction. Disabling non-essential smartphone push notifications and designating phone-free zones during family dinners curbs compulsive screen-checking habits. By reclaiming cognitive agency from algorithmic feeds, individuals rediscover the peaceful pleasure of reading immersive literature and engaging in uninterrupted conversations."
  },

  // ==========================================
  // TOPIC 10: GENERAL KNOWLEDGE (8 paragraphs)
  // 3 Beginner, 3 Intermediate, 1 Advanced, 1 Expert
  // ==========================================
  {
    id: "gen-001",
    topic: "general knowledge",
    difficulty: "beginner",
    recommendedDuration: 60,
    content: "Clocks and wristwatches measure the steady passage of time using synchronized ticking mechanisms or vibrating quartz crystals. Standard sixty-minute hours and twenty-four-hour days help societies coordinate school schedules, train departures, and international business meetings across the modern world with dependable precision."
  },
  {
    id: "gen-002",
    topic: "general knowledge",
    difficulty: "beginner",
    recommendedDuration: 60,
    content: "Automated traffic signals use universal red, yellow, and green lights to regulate vehicle flows through busy street intersections safely. Red means complete stop, yellow advises caution for an impending change, and green allows traffic to proceed. This simple visual color system prevents chaotic vehicle collisions worldwide."
  },
  {
    id: "gen-003",
    topic: "general knowledge",
    difficulty: "beginner",
    recommendedDuration: 60,
    content: "Bridges are remarkable engineering structures built to span physical obstacles like wide rivers, deep mountain canyons, and busy expressways. By carrying vehicular traffic, freight trains, and pedestrians across challenging terrain, bridges unite separated communities and facilitate regional economic commerce."
  },
  {
    id: "gen-004",
    topic: "general knowledge",
    difficulty: "intermediate",
    recommendedDuration: 90,
    content: "Public libraries serve as indispensable civic sanctuaries providing free, equitable access to literature, digital learning resources, and historical archives. Beyond lending thousands of physical books, modern libraries host literacy workshops, provide public internet access for job seekers, and offer quiet study spaces. They remain democratic pillars that support lifelong learning across all social demographics."
  },
  {
    id: "gen-005",
    topic: "general knowledge",
    difficulty: "intermediate",
    recommendedDuration: 90,
    content: "Standardized international time zones were established in the late nineteenth century to resolve scheduling chaos caused by expanding cross-country railway systems. Prior to this global agreement, each town set its clocks by local solar noon, causing conflicting timetables. Dividing the globe into twenty-four standardized hourly zones coordinated transit schedules and enabled smooth international communication."
  },
  {
    id: "gen-006",
    topic: "general knowledge",
    difficulty: "intermediate",
    recommendedDuration: 120,
    content: "Modern banknotes integrate sophisticated overt and covert security features to deter illicit counterfeit duplication. Central banks print paper currency on specialized cotton-linen substrates embedded with fluorescent threads, color-shifting optical inks, and transparent polymer windows with micro-lettering. These tactile tactile watermarks and holographic foils permit rapid authentication by human touch and automated optical banking scanners."
  },
  {
    id: "gen-007",
    topic: "general knowledge",
    difficulty: "advanced",
    recommendedDuration: 180,
    content: "Architectural acoustics balances geometric room shapes and surface material textures to optimize sound propagation inside concert symphony halls. Acoustic engineers position convex reflection diffusers and sound-absorbing fiberglass panels to prevent muddying flutter echoes while preserving rich sonic warmth. Controlling early lateral sound reflections ensures that delicate orchestral violin passages reach listeners in the highest balconies with pristine clarity."
  },
  {
    id: "gen-008",
    topic: "general knowledge",
    difficulty: "expert",
    recommendedDuration: 300,
    content: "The mathematical discipline of cartographic projection grapples with the fundamental impossibility of flattening an oblate spheroidal planetary surface onto a two-dimensional Euclidean plane without introducing geometric distortion. The conformal Mercator projection preserves directional rhumb lines essential for maritime compass navigation at the expense of extreme polar area exaggeration. Conversely, equal-area sinusoidal and Mollweide projections accurately preserve landmass ratios while introducing angular shear distortions along peripheral outer meridians."
  },

  // ==========================================
  // TOPIC 11: LITERATURE AND COMMUNICATION (8 paragraphs)
  // 2 Beginner, 4 Intermediate, 1 Advanced, 1 Expert
  // ==========================================
  {
    id: "lit-001",
    topic: "literature and communication",
    difficulty: "beginner",
    recommendedDuration: 60,
    content: "Poetry uses rhythmic meter, evocative imagery, and lyrical rhymes to express profound emotional experiences in concise language. Poets select each word with extraordinary care, creating musical cadences that resonate in the reader's imagination long after the poem has been read aloud."
  },
  {
    id: "lit-002",
    topic: "literature and communication",
    difficulty: "beginner",
    recommendedDuration: 60,
    content: "Handwriting personal letters with ink on fine paper conveys warmth and deliberate mindfulness that quick electronic text messages cannot replicate. Taking time to compose thoughtful sentences creates a lasting physical keepsake that friends and loved ones cherish across years of distance."
  },
  {
    id: "lit-003",
    topic: "literature and communication",
    difficulty: "intermediate",
    recommendedDuration: 90,
    content: "Compelling storytelling has united human cultures around communal campfires since the dawn of civilization. Oral folktales, heroic myths, and ancestral legends passed down through spoken word preserved historical values and taught ethical lessons before writing existed. These shared narratives established cultural identity, deepened communal bonds, and reminded listeners of enduring universal human dilemmas."
  },
  {
    id: "lit-004",
    topic: "literature and communication",
    difficulty: "intermediate",
    recommendedDuration: 90,
    content: "Complex character development forms the emotional heartbeat of unforgettable fictional literature. Masterful authors craft flawed, multifaceted protagonists who experience internal moral dilemmas, make regrettable errors, and undergo genuine psychological growth. As readers witness fictional characters struggle against external adversity and personal weaknesses, they develop deeper empathy for diverse real-world human perspectives."
  },
  {
    id: "lit-005",
    topic: "literature and communication",
    difficulty: "intermediate",
    recommendedDuration: 120,
    content: "Vivid figurative language like metaphors and similes elevates ordinary expository prose into memorable art. By drawing illuminating comparisons between seemingly unrelated concepts, writers evoke visceral sensory imagery in the reader's mind without requiring lengthy technical descriptions. Thoughtful symbolic motifs woven subtly throughout a narrative invite readers to interpret deeper philosophical themes beneath the surface plot."
  },
  {
    id: "lit-006",
    topic: "literature and communication",
    difficulty: "intermediate",
    recommendedDuration: 120,
    content: "Effective interpersonal rhetoric balances logical reasoning, emotional resonance, and speaker credibility. Ancient philosophers recognized that persuasive public address requires disciplined logic supported by verifiable facts, an empathetic understanding of the audience's emotional sensibilities, and unblemished personal integrity. Cultivating authentic persuasive rhetoric empowers leaders to inspire collective action during pivotal moments."
  },
  {
    id: "lit-007",
    topic: "literature and communication",
    difficulty: "advanced",
    recommendedDuration: 180,
    content: "Modernist literature revolutionized fictional narrative structure through the stream-of-consciousness technique pioneered by authors like Virginia Woolf and James Joyce. Rather than following chronological third-person exposition, the narrative flows through the subjective, nonlinear sensory impressions and fragmented interior monologues of the characters. This psychological realism mirrors the chaotic, associative way the human mind experiences perception and memory."
  },
  {
    id: "lit-008",
    topic: "literature and communication",
    difficulty: "expert",
    recommendedDuration: 300,
    content: "Structuralist literary hermeneutics and semiotics conceptualize literary texts as complex networks of relational signs where linguistic meaning derives not from intrinsic referents, but from differential binary oppositions within cultural codes. Ferdinand de Saussure's foundational distinction between signifier and signified underscores the arbitrary nature of the linguistic sign, challenging naive mimetic theories of representation. Deconstructive textual analyses demonstrate how literary texts inevitably unravel their own foundational premises through internal contradictions and semantic indeterminacy."
  }
];

// Calculate programmatic word and character counts
const paragraphs = rawParagraphs.map((p, index) => {
  const words = p.content.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const characterCount = p.content.length;
  return {
    id: p.id,
    content: p.content,
    topic: p.topic,
    difficulty: p.difficulty,
    wordCount,
    characterCount,
    recommendedDuration: p.recommendedDuration
  };
});

// Deterministic Validation Suite
console.log('--- RUNNING DETERMINISTIC VALIDATION SUITE ---');

// 1. Total Count Check
console.log(`1. Total paragraph count: ${paragraphs.length} (Expected: 100)`);
if (paragraphs.length !== 100) {
  throw new Error(`Invalid total count: ${paragraphs.length}`);
}

// 2. ID Uniqueness Check
const idSet = new Set();
for (const p of paragraphs) {
  if (idSet.has(p.id)) {
    throw new Error(`Duplicate ID detected: ${p.id}`);
  }
  idSet.add(p.id);
}
console.log(`2. All ${idSet.size} IDs are unique.`);

// 3. Content Uniqueness Check
const contentSet = new Set();
for (const p of paragraphs) {
  const normalized = p.content.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (contentSet.has(normalized)) {
    throw new Error(`Duplicate content detected in paragraph ${p.id}`);
  }
  contentSet.add(normalized);
}
console.log(`3. All 100 paragraph contents are 100% unique.`);

// 4. Topic Distribution Check
const expectedTopics = {
  "technology": 12,
  "science": 10,
  "history": 10,
  "geography": 8,
  "nature and environment": 10,
  "education": 10,
  "business and economics": 8,
  "space and astronomy": 8,
  "everyday life": 8,
  "general knowledge": 8,
  "literature and communication": 8
};

const topicCounts = {};
for (const p of paragraphs) {
  topicCounts[p.topic] = (topicCounts[p.topic] || 0) + 1;
}

console.log('4. Topic distribution counts:');
for (const [topic, expected] of Object.entries(expectedTopics)) {
  const actual = topicCounts[topic] || 0;
  console.log(`   - ${topic}: ${actual} (Expected: ${expected})`);
  if (actual !== expected) {
    throw new Error(`Topic count mismatch for ${topic}: got ${actual}, expected ${expected}`);
  }
}

// 5. Difficulty Distribution Check
const expectedDifficulties = {
  "beginner": 25,
  "intermediate": 35,
  "advanced": 25,
  "expert": 15
};

const diffCounts = {};
for (const p of paragraphs) {
  diffCounts[p.difficulty] = (diffCounts[p.difficulty] || 0) + 1;
}

console.log('5. Difficulty distribution counts:');
for (const [diff, expected] of Object.entries(expectedDifficulties)) {
  const actual = diffCounts[diff] || 0;
  console.log(`   - ${diff}: ${actual} (Expected: ${expected})`);
  if (actual !== expected) {
    throw new Error(`Difficulty mismatch for ${diff}: got ${actual}, expected ${expected}`);
  }
}

// 6. Word Count & Content Quality Checks
for (const p of paragraphs) {
  if (p.wordCount < 30) {
    throw new Error(`Paragraph ${p.id} is too short (${p.wordCount} words)`);
  }
  if (!p.content.endsWith('.')) {
    throw new Error(`Paragraph ${p.id} does not end with a period.`);
  }
}
console.log('6. All word counts and punctuation verified.');

const outputData = {
  version: 1,
  totalParagraphs: paragraphs.length,
  generatedAt: new Date().toISOString(),
  paragraphs
};

const outputPath = path.join(__dirname, '..', 'public', 'typing-paragraphs-v1.json');
fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf-8');

console.log(`--- SUCCESS: typing-paragraphs-v1.json written to ${outputPath} ---`);
