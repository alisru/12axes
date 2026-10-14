export interface HegemonicScenarioSet {
  willBe: string;      // Top-Left (+υ, +ψ): Agree for Everyone (Civic / Fair Go / Collective Wellbeing)
  cantBe: string;      // Top-Right (-υ, +ψ): Agree for Self/Group (Looking out for #1 / Private Advantage)
  mayBe: string;       // Bottom-Left (+υ, -ψ): Disagree for Everyone (Systemic Defense / Protecting Community from Harm)
  wontBe: string;      // Bottom-Right (-υ, -ψ): Disagree for Self/Group (Defensive Self-Interest / Not Getting Ripped Off)
  indifferent: string; // Center (0, 0): Honest Confusion / Uncertainty ("I don't know / Not sure")
}

export interface HegemonicScenario9Set {
  // Top Row (+ψ, Active / "Do")
  topLeft: string;      // (+1.15, +1.15): Civic / Universal Action
  topCenter: string;    // (0, +1.15): Pragmatic / Direct Action
  topRight: string;     // (-1.15, +1.15): Individual / Personal Advantage Action

  // Middle Row (0ψ, Principle / IS / "Present")
  midLeft: string;      // (+1.15, 0): Goodwill in Principle
  center: string;       // (0, 0): Honest Confusion / Uncertainty ("I don't know / Not sure")
  midRight: string;     // (-1.15, 0): Skepticism in Principle

  // Bottom Row (-ψ, Counteractive / "Do Not")
  bottomLeft: string;   // (+1.15, -1.15): Protect Public Good / Prevent Harm
  bottomCenter: string; // (0, -1.15): Maintain State / Institutional Stability
  bottomRight: string;  // (-1.15, -1.15): Anti-Freeloader / Avoid Being Exploited
}

export type HegemonicScenario = HegemonicScenarioSet | HegemonicScenario9Set;

export function isScenario9Set(s: HegemonicScenario): s is HegemonicScenario9Set {
  return 'topLeft' in s && 'topCenter' in s;
}

export const HEGEMONIC_SCENARIOS: Record<'en' | 'pt', Record<string, HegemonicScenario>> = {
  en: {
    // ECONOMIA
    economia_10: {
      topLeft: "People will contribute generously to their community if they're treated like adults and asked to pitch in, rather than forced.",
      topCenter: "Switch to a user-pays model where people only pay for the specific public services they actually use.",
      topRight: "People earn their money and should decide where every dollar goes, without the government taking it out of their pay.",
      midLeft: "In an ideal world people would contribute willingly without force, but there is no proven way to run a whole country like that today.",
      center: "I don't know / Not sure — hard to know how a voluntary funding system would actually function in practice.",
      midRight: "It sounds nice in theory, but in reality most people simply won't pay for shared services if they don't have to.",
      bottomLeft: "Voluntary funding would starve public hospitals, schools, and safety nets, leaving vulnerable people with nothing.",
      bottomCenter: "Compulsory taxes are the only realistic way to guarantee stable funding for the infrastructure and essential services the country relies on.",
      bottomRight: "The wealthy and dishonest would find ways to pay nothing, leaving honest taxpayers to carry the whole load."
    },
    economia_01: {
      topLeft: "Wealth concentration has reached obscene levels; only a radical democratic overhaul can break corporate monopolies and give every citizen a fair go.",
      topCenter: "Break up corporate oligopolies through aggressive trust-busting and heavily tax excessive windfall profits to fund public infrastructure.",
      topRight: "The economic game is rigged against everyday workers; tearing down billionaire cartels is the only way people like us will ever get a decent cut.",
      midLeft: "Extreme inequality is deeply unhealthy for society, but violent upheaval usually causes massive suffering and rarely delivers what it promises.",
      center: "I don't know / Not sure — massive corporate power is obviously crook, but violent revolutions usually make everyday life much worse.",
      midRight: "Taking down big companies sounds heroic, but radical socialist overhauls always end up mismanaged by incompetent bureaucrats.",
      bottomLeft: "Violent revolutions destroy social trust, collapse the economy, and lead directly to dictatorship; genuine reform must come through peaceful laws.",
      bottomCenter: "Maintain the rule of law and secure property rights; an unpredictable legal climate scares off investment and destroys national prosperity.",
      bottomRight: "Every time radicals launch wealth seizures, everyday families and small business owners end up losing their savings and what they worked to build."
    },
    economia_02: {
      topLeft: "Genuine competition drives innovation, improves service standards, and saves taxpayer money compared to sleepy government monopolies.",
      topCenter: "Tender out service contracts to competing private bidders, with strict penalties for failing to meet performance and reliability targets.",
      topRight: "Allowing private enterprise gives local businesses and contractors a chance to compete instead of locking every job behind government red tape.",
      midLeft: "Market competition works well for consumer goods, but basic public essentials like healthcare and power need strong non-profit guarantees.",
      center: "I don't know / Not sure — competitive transport might work fine, but privatizing water or emergency care feels dangerous.",
      midRight: "Private firms can be efficient, but big corporations usually just form cartels, buy off regulators, and eliminate real competition anyway.",
      bottomLeft: "Essential public services exist to serve people, not generate private profit; privatization leads to cut corners, sacked workers, and neglected vulnerable users.",
      bottomCenter: "Core utilities and public infrastructure should be directly run by public authorities to ensure long-term stability and equitable universal access.",
      bottomRight: "Every time politicians sell off a public asset, our utility bills skyrocket, maintenance gets slashed, and customer service goes down the toilet."
    },
    economia_03: {
      topLeft: "Crucial infrastructure like ports, power grids, and water systems are vital to national security and must stay owned by the public.",
      topCenter: "Keep majority public ownership and voting control over critical infrastructure to stop foreign corporations from holding national assets hostage.",
      topRight: "Keeping strategic assets in public hands protects local jobs and stops predatory private monopolies from price-gouging our households.",
      midLeft: "Public ownership makes sense for vital lifelines, but everyday commercial industries run much better under private management.",
      center: "I don't know / Not sure — energy grids should probably stay public, but deciding which companies count as 'strategic' is tricky.",
      midRight: "Government control sounds patriotic, but state-owned companies usually end up bloated, inefficient, and bleeding taxpayer cash.",
      bottomLeft: "Private enterprises adapt faster, innovate more, and take on commercial risks without leaving the public to foot the bill when mistakes happen.",
      bottomCenter: "Governments should stick to regulation and safety standards, leaving commercial operations to private companies that specialize in them.",
      bottomRight: "State-owned monopolies turn into protected clubs for political mates and union bosses, funded directly out of our hard-earned taxes."
    },

    // ESTRUTURA
    estrutura_01: {
      topLeft: "Give local communities and councils the power to run their own affairs, because locals actually understand what their people need.",
      topCenter: "Hand more power to regional and local governments, and only bring in the national government for big issues that cross borders.",
      topRight: "Let our town make its own decisions and keep its own money without distant bureaucrats telling us how to live.",
      midLeft: "Local communities should ideally govern themselves, but poorer regions often lack the resources to handle everything on their own.",
      center: "I don't know / Not sure — hard to draw the line between what locals know best and what needs national coordination.",
      midRight: "Local control sounds good in theory, but small councils often end up captured by petty politics and local cliques.",
      bottomLeft: "National oversight is essential so that every citizen, no matter what town they live in, has access to the same rights and public standards.",
      bottomCenter: "Maintain strong national coordination; leaving major policies to scattered local councils creates chaotic, conflicting rules across the country.",
      bottomRight: "Regional communities depend heavily on federal funding to survive; pushing the national government away would leave our local services starved of cash."
    },
    estrutura_02: {
      topLeft: "Every citizen should have the exact same rights and legal protections, no matter what part of the country they live in.",
      topCenter: "Standardize the main laws across the country so rules and regulations are the same everywhere.",
      topRight: "One set of laws makes it much simpler to run a business, move for work, and trade without dealing with multiple regional rulebooks.",
      midLeft: "Equal rights under one law makes sense in principle, but remote regions have unique challenges that rigid national rules often ignore.",
      center: "I don't know / Not sure — criminal laws should probably be uniform, but local planning and customs might need regional exceptions.",
      midRight: "National consistency sounds tidy, but central politicians usually pass laws that suit capital cities while ignoring what the regions want.",
      bottomLeft: "Different regions have distinct cultures and circumstances; forcing a one-size-fits-all legal system on communities that oppose it is wrong.",
      bottomCenter: "Regions should keep the right to pass their own laws based on local conditions, rather than having national rules forced upon them.",
      bottomRight: "People in distant capitals shouldn't be able to overrule our regional laws and force rules onto us that our local community voted against."
    },
    estrutura_03: {
      topLeft: "Local councils and communities are directly accountable to the neighbours they see every day; letting them make local laws keeps government close to the people.",
      topCenter: "Pass local bylaws at the council level so town planning, parking, and community amenities can be solved quickly without state government delays.",
      topRight: "Our town should set its own local business rules and rates so small businesses and homeowners here aren't strangled by big-city regulations.",
      midLeft: "Local lawmaking makes sense in principle, but smaller councils often lack the legal expertise to draft sound regulations without central help.",
      center: "I don't know / Not sure — some zoning and parking issues are clearly local, but environmental and building standards probably need broader oversight.",
      midRight: "It sounds democratic in theory, but small councils are notorious for petty politics, nimbyism, and favoring their own mates over residents.",
      bottomLeft: "Crucial standards for health, safety, and tenant rights must be set nationally or statewide; leaving them to local councils leaves vulnerable residents unprotected.",
      bottomCenter: "Maintain statewide or national legal consistency; having dozens of different local laws in neighboring suburbs creates confusion and costly legal disputes.",
      bottomRight: "Local councils already gouge homeowners on rates and waste money on pet projects; giving them more power to pass fines and bylaws just means more fees for us."
    },
    estrutura_04: {
      topLeft: "Every child in the country deserves the exact same high-quality education, regardless of what postcode they grow up in.",
      topCenter: "Standardise math, science, and literacy standards nationally so families moving between states don't face disrupted schooling.",
      topRight: "A single national curriculum ensures our qualifications and test scores are recognised nationwide when applying for university and jobs.",
      midLeft: "National benchmarks are great in theory, but teachers need the flexibility to adapt lessons to the specific needs of local students.",
      center: "I don't know / Not sure — core subjects like math should be national, but local history and vocational training might be better handled regionally.",
      midRight: "A centralized curriculum usually ends up hijacked by whichever political party is in power in the capital pushing their ideological agenda.",
      bottomLeft: "Different regions have distinct community needs, languages, and cultural histories that a rigid, one-size-fits-all national syllabus completely erases.",
      bottomCenter: "Regional and state education departments understand their local schools and teacher capacity far better than distant central bureaucrats.",
      bottomRight: "Parents and local school boards should decide what their children are taught, rather than bureaucrats hundreds of miles away dictating values to our families."
    },
    estrutura_05: {
      topLeft: "States are sovereign partners in the nation; letting them frame their own democratic constitutions respects local democracy and diverse cultural traditions.",
      topCenter: "Give states constitutional independence to design their own parliamentary and judicial structures to suit their regional scale.",
      topRight: "Our state should govern its own affairs and protect our local tax base without Canberra or central politicians interfering.",
      midLeft: "State constitutions make sense in principle, provided they are bound to respect universal national human rights and core democratic standards.",
      center: "I don't know / Not sure — states need administrative independence, but having completely different constitutions could fracture the country.",
      midRight: "Letting states draft separate constitutions often leads to gerrymandering and local oligarchs locking in power with zero outside checks.",
      bottomLeft: "A unified country requires a single foundational constitution guaranteeing equal rights and freedoms to every citizen regardless of the state they're in.",
      bottomCenter: "Multiple competing state constitutions create conflicting court systems, legal gridlock, and threaten national unity.",
      bottomRight: "We shouldn't risk corrupt state politicians writing discriminatory clauses into local constitutions that strip ordinary citizens of their basic protections."
    },

    // REPRESENTACAO
    representacao_01: {
      topLeft: "Even when the public picks a terrible government, free voting is the only peaceful way citizens can hold power to account and vote them out.",
      topCenter: "Protect the integrity of the ballot box and independent electoral commissions so voters always retain the right to fire their leaders.",
      topRight: "I want my vote to count so politicians have to face working people in their electorates, rather than some unelected official deciding for us.",
      midLeft: "Democratic elections are the best foundation we have, but voters can be misled by media disinformation and populism.",
      center: "I don't know / Not sure — politicians are often hopeless, but any system that scraps elections usually turns into tyranny.",
      midRight: "Elections just give people the illusion of choice between two sets of corrupt party apparatchiks who both answer to corporate donors.",
      bottomLeft: "When a destructive or extremist government is actively wrecking the nation's future, waiting years for the next election can cause irreversible damage.",
      bottomCenter: "Constitutional institutions, expert judges, and technical bodies must have the power to constrain erratic elected politicians when necessary.",
      bottomRight: "Uninformed mobs repeatedly vote in reckless governments that run up huge debts and jack up taxes on the productive people who actually work."
    },
    representacao_02: {
      topLeft: "During catastrophic emergencies, wars, or natural disasters, decisive executive leadership is vital to protect the population without paralysis.",
      topCenter: "Allow time-limited emergency executive powers to coordinate disaster relief, rescue efforts, and supply chains rapidly.",
      topRight: "In a crisis, I want a leader who can cut straight through bureaucratic red tape and protect my community without endless political debates.",
      midLeft: "Quick executive decisions are necessary in a flash crisis, but they must face mandatory parliamentary review as soon as the danger passes.",
      center: "I don't know / Not sure — speed matters in a disaster, but giving a single politician unchecked power is dangerous.",
      midRight: "Politicians routinely hype up fake crises just to grab emergency powers that they never willingly give back.",
      bottomLeft: "Concentrating unchecked power in one person's hands invites tyranny; parliamentary oversight and public debate exist precisely to prevent abuses.",
      bottomCenter: "The constitution and legislature must never be sidelined; democratic laws and judicial checks are our most important defense against autocracy.",
      bottomRight: "Once a leader starts ruling by decree, ordinary citizens lose their civil liberties and anyone who speaks out gets crushed."
    },
    representacao_03: {
      topLeft: "The freedom to criticize leaders in public is essential to a free society; exposing government incompetence and corruption keeps leaders honest.",
      topCenter: "Protect open debate and investigative journalism so ministers are questioned aggressively on their policy records.",
      topRight: "I have a fundamental right to call out bad government decisions that hurt my family or livelihood without fear of police harassment.",
      midLeft: "Constructive opposition criticism is healthy, but constant partisan smear campaigns erode public trust in national institutions.",
      center: "I don't know / Not sure — freedom of speech is vital, but politicians often use it just to spread toxic rumors and division.",
      midRight: "Opposition parties don't actually care about accountability; they just criticize whatever the government does to score cheap political points.",
      bottomLeft: "During wartime or national emergencies, destructive political attacks undermine national morale and jeopardize public security.",
      bottomCenter: "Public opposition should follow orderly parliamentary rules; reckless disinformation campaigns that undermine state institutions must be restrained.",
      bottomRight: "Hostile political factions shouldn't be allowed to weaponize lies and slander to destabilize the country and disrupt everyday life."
    },

    // PODER / LEI E ORDEM
    poder_01: {
      topLeft: "Law-abiding families and local businesses deserve safety; allowing violent gangs to control suburbs destroys the entire community.",
      topCenter: "Deploy coordinated police taskforces to dismantle organized crime syndicates and seize illegal weapons.",
      topRight: "Clean out violent criminals so my family can walk down our own street in peace without getting mugged or threatened.",
      midLeft: "Strong policing is needed against violent crime, but officers must maintain community trust and respect basic human rights.",
      center: "I don't know / Not sure — gangs need to be stopped, but aggressive raids often catch innocent bystanders in the crossfire.",
      midRight: "Heavy-handed raids make good headlines, but cops usually just harass petty offenders while the real gang bosses walk away clean.",
      bottomLeft: "Militarized police operations terrorize marginalized neighbourhoods, cause wrongful deaths, and don't fix the underlying poverty driving crime.",
      bottomCenter: "Rely on judicial oversight, intelligence-led investigations, and youth programs rather than unchecked paramilitary policing.",
      bottomRight: "Whenever police get blank-check powers, innocent working people get pulled over, searched, and treated like suspects on their way to work."
    },
    poder_02: {
      topLeft: "Adults should have the personal freedom to choose what they consume; decriminalisation ends pointless arrests and redirects police to violent crime.",
      topCenter: "Regulate and tax adult cannabis like alcohol and tobacco, using the tax revenue to fund public healthcare and mental health services.",
      topRight: "I should be able to unwind after a hard week's work without fear of cops, criminal records, or losing my employment.",
      midLeft: "Decriminalising possession makes sense to stop ruining young lives, provided drug driving and public nuisance are strictly policed.",
      center: "I don't know / Not sure — treating it as a crime seems excessive, but commercialising it might increase youth dependency.",
      midRight: "Politicians claim legalisation brings tax revenue, but it usually just creates corporate drug cartels and more public health problems.",
      bottomLeft: "Widespread cannabis use increases youth psychosis and mental illness, putting massive extra pressure on hospitals and family carers.",
      bottomCenter: "Maintain prohibition to send a clear message that drug abuse is harmful to public health and social order.",
      bottomRight: "Keep drug culture and smoke away from our children, our front gates, and people driving on our local suburban roads."
    },
    poder_03: {
      topLeft: "Targeted digital surveillance helps intelligence agencies intercept terrorist plots, drug cartels, and child exploitation networks before innocent people get hurt.",
      topCenter: "Require judicial warrants and strict oversight for security agencies to monitor encrypted criminal communications.",
      topRight: "If law enforcement has the tools to stop violent predators and organized gangs targeting our communities, they should use them.",
      midLeft: "Tracking dangerous extremists makes sense, but surveillance powers must be strictly confined to serious crimes with independent judicial oversight.",
      center: "I don't know / Not sure — catching terrorists is essential, but mass automated snooping feels like an invasion of privacy.",
      midRight: "Government agencies claim surveillance is for public safety, but they always end up using it to monitor peaceful dissenters and political rivals.",
      bottomLeft: "Mass digital monitoring destroys personal privacy and creates a surveillance state where every citizen is treated as a guilty suspect.",
      bottomCenter: "Protect constitutional privacy and encryption; undermining secure digital communications exposes national infrastructure to foreign hackers.",
      bottomRight: "Government departments can't even stop basic data leaks; giving them access to our private messages is an open invitation for blackmail and abuse."
    },

    // IMIGRACAO
    imigracao_01: {
      topLeft: "A shared common language and mutual civic values are the bedrock of social cohesion and mutual trust in a successful democracy.",
      topCenter: "Provide free, mandatory language and civics classes for all new arrivals so they can integrate quickly into the workforce and community.",
      topRight: "If you choose to move here to work and build a life, learning the language and fitting in with local customs makes daily work and neighborhood life easy for everyone.",
      midLeft: "Learning the national language is practical for work and civic life, but families should be free to maintain their heritage and cultural traditions at home.",
      center: "I don't know / Not sure — knowing the language is essential for jobs, but forcing people to abandon their cultural customs feels wrong.",
      midRight: "Politicians push integration slogans, but they don't provide the language classes or support needed for migrants to actually assimilate.",
      bottomLeft: "Forcing cultural conformity suppresses rich diverse heritages and alienates migrant communities instead of welcoming their contribution.",
      bottomCenter: "The law must protect freedom of cultural expression and cultural diversity, not enforce state-sanctioned lifestyle conformity.",
      bottomRight: "Nobody should have their language or cultural heritage dictated by narrow-minded politicians looking to score cheap nationalist points."
    },
    imigracao_02: {
      topLeft: "Multilingualism enriches our national culture, deepens global connections, and ensures non-English speakers can access essential services with dignity.",
      topCenter: "Fund bilingual translation in hospitals, courts, and emergency communications so vital public services remain accessible to everyone.",
      topRight: "Being multilingual gives our children and local businesses massive commercial advantages in international trade and tourism.",
      midLeft: "Embracing multiple languages is culturally vibrant, provided there is still a shared common language that unites the country in civic life.",
      center: "I don't know / Not sure — multilingual services are helpful in emergencies, but not having a single shared language could divide communities.",
      midRight: "Multilingual signage and services sound nice, but government agencies waste huge sums on tokenistic translation rather than teaching people English.",
      bottomLeft: "Without a shared common language, society fractures into isolated language enclaves with little communication or mutual trust between groups.",
      bottomCenter: "Maintain the national language as the sole standard for official government business, courts, and schooling to safeguard unified national identity.",
      bottomRight: "I shouldn't have to navigate public services or street signs in foreign languages in my own hometown; everyone here should speak the common tongue."
    },
    imigracao_03: {
      topLeft: "Rapid population growth strains public infrastructure and dilutes local cultural cohesion; pausing intake allows existing communities to integrate.",
      topCenter: "Temporarily cap immigration numbers and tie annual intakes strictly to local housing supply and hospital capacity.",
      topRight: "Pausing high migration stops landlords from jacking up rents and protects local working people from having their wages undercut.",
      midLeft: "Slowing down intake makes practical sense while housing is in crisis, but completely shutting borders to refugees and skilled workers is unfeasible.",
      center: "I don't know / Not sure — current migration levels are straining housing and roads, but completely shutting the door could hurt hospitals and farms.",
      midRight: "Politicians blame cultural identity for border issues, but really big corporations lobby for high migration just to suppress domestic wages.",
      bottomLeft: "Completely closing borders strangles our universities, deprives healthcare of nurses, and abandons humanitarian commitments to desperate refugees.",
      bottomCenter: "A modern economy depends on international talent and dynamic global engagement; shutting borders leads directly to cultural and economic stagnation.",
      bottomRight: "Stoking paranoia about foreign cultures is a cynical distraction used by politicians to avoid fixing housing shortages and health funding."
    },

    // DIPLOMACIA
    diplomacia_01: {
      topLeft: "A credible defense force deters aggressive authoritarian regimes and secures peaceful international shipping lanes for everyone.",
      topCenter: "Equip our military with modern defensive capabilities, naval patrol vessels, and domestic cyber defenses.",
      topRight: "A strong defense force stops foreign powers from pushing us around and protects our national resources and trade routes.",
      midLeft: "Maintaining a competent military is a necessary insurance policy, but true international respect comes from humanitarian aid, trade, and diplomacy.",
      center: "I don't know / Not sure — we obviously need to defend our borders, but pouring billions into shiny weapons while hospitals struggle feels wrong.",
      midRight: "Defense budgets always blow out, enriching foreign arms contractors without making our everyday communities any safer.",
      bottomLeft: "Stockpiling massive offensive arsenals fuels regional arms races, escalates tensions, and diverts billions away from schools and healthcare.",
      bottomCenter: "Security is built through multilateral treaties, international law, and regional cooperation, not sabre-rattling.",
      bottomRight: "We shouldn't waste our taxes playing deputy sheriff in overseas arms races that only benefit overseas weapons manufacturers."
    },
    diplomacia_02: {
      topLeft: "War brings catastrophic human devastation; every single diplomatic avenue must be exhausted to protect human life and regional stability.",
      topCenter: "Engage multilateral diplomats, independent mediators, and targeted diplomatic pressure to resolve conflicts before considering military force.",
      topRight: "Exhausting diplomacy stops our sons and daughters in uniform from being sent to die in unnecessary overseas quagmires.",
      midLeft: "Diplomacy should always be the default approach, but negotiations must be backed by credible resolve if the other side acts in bad faith.",
      center: "I don't know / Not sure — diplomacy should be tried first, but when facing a ruthless dictator, endless talking can just buy them time to attack.",
      midRight: "Endless diplomatic summits are mostly photo-ops for politicians while hostile forces prepare on the ground anyway.",
      bottomLeft: "Hesitating and negotiating endlessly with aggressive invaders gives them time to build military footholds and commit mass atrocities.",
      bottomCenter: "Credible military readiness and rapid counter-action are essential; an enemy preparing a strike won't be stopped by polite diplomatic letters.",
      bottomRight: "Naive appeasement only emboldens hostile regimes; standing down our defenses leaves our nation vulnerable to economic and military extortion."
    },
    diplomacia_03: {
      topLeft: "Neutralizing a confirmed imminent attack before missiles or forces launch protects millions of innocent civilian lives from catastrophic destruction.",
      topCenter: "Authorize targeted strikes strictly against confirmed imminent launch sites or aggressive staging operations under rigorous intelligence proof.",
      topRight: "If an enemy is openly aiming weapons at our cities, I want our forces to hit them first rather than sitting back and absorbing the hit.",
      midLeft: "Self-defense against an imminent attack is legitimate, but launching strikes without international consensus sets a dangerous global precedent.",
      center: "I don't know / Not sure — hitting a missile before it fires makes sense, but intelligence can be dead wrong and trigger an unnecessary war.",
      midRight: "Governments frequently fabricate intelligence about 'imminent threats' just to justify illegal regime-change invasions.",
      bottomLeft: "Preemptive strikes normalize aggression, tear up the UN Charter, and drag nations into uncontrollable, bloody conflicts based on flawed intelligence.",
      bottomCenter: "Military force is only lawful in response to an actual armed attack or with explicit UN Security Council authorization.",
      bottomRight: "Warmongering politicians shouldn't be allowed to drag our country into foreign wars based on dodgy dossiers that our soldiers have to die for."
    },

    // INTERVENCAO
    intervencao_01: {
      topLeft: "Every nation has the sovereign right to self-determination; foreign-sponsored coups and invasions always cause chaos and destroy civilian lives.",
      topCenter: "Enforce strict non-intervention treaties and ban covert foreign funding or paramilitary meddling in other nations' political affairs.",
      topRight: "Our country should mind its own business and fix problems at home rather than wasting our blood and treasure trying to fix other countries.",
      midLeft: "Non-intervention is the correct baseline, but there must be rare exceptions when a regime is actively committing genocide against its own people.",
      center: "I don't know / Not sure — foreign meddling usually backfires, but watching a brutal dictator slaughter civilians without lifting a finger feels wrong.",
      midRight: "Superpowers never intervene for democracy; they only overthrow governments to grab oil, minerals, and lucrative corporate contracts.",
      bottomLeft: "The international community has a moral responsibility to protect civilians and remove tyrants who commit crimes against humanity.",
      bottomCenter: "Democratic nations must support democratic movements abroad and use coordinated sanctions to isolate illegitimate military juntas.",
      bottomRight: "Allowing hostile dictatorships to crush freedom abroad creates rogue states that eventually threaten our own trade and security."
    },
    intervencao_02: {
      topLeft: "A government's primary duty is to safeguard its own citizens; applying diplomatic and economic pressure abroad is necessary to protect national security.",
      topCenter: "Use trade leverage, targeted sanctions, and regional diplomatic coalitions to protect critical maritime routes and supply chains.",
      topRight: "When other countries dump cheap steel, steal our technology, or block our exports, our government should push back hard to protect local jobs.",
      midLeft: "Defending national interests is reasonable, provided pressure follows international trade rules and doesn't bully smaller, developing neighbours.",
      center: "I don't know / Not sure — we have to stand up for our interests, but being too aggressive can provoke trade wars that hurt ordinary consumers.",
      midRight: "Politicians shout about 'national interest' when really they're just doing the bidding of powerful mining and defense lobby groups.",
      bottomLeft: "Coercive pressure, economic blockades, and sanctions hurt innocent everyday families in foreign countries while corrupt elites remain untouched.",
      bottomCenter: "International disputes should be resolved through binding WTO arbitration and international law, not unilateral geopolitical pressure.",
      bottomRight: "Picking fights and imposing aggressive trade pressure backfires immediately when foreign powers retaliate by sanctioning our farmers and miners."
    },
    intervencao_03: {
      topLeft: "Automatic military entanglements drag peaceful countries into catastrophic overseas conflicts that have nothing to do with defending our own shores.",
      topCenter: "Maintain an independent, self-reliant defense posture focused strictly on territorial defense rather than expeditionary foreign alliances.",
      topRight: "Our service personnel should only fight to defend our own country, not be used as cannon fodder in superpower proxy wars on the other side of the planet.",
      midLeft: "Avoiding entanglement in foreign wars is sensible, but standing alongside democratic allies against global aggression provides long-term deterrence.",
      center: "I don't know / Not sure — alliances can pull us into dumb overseas wars, but going completely alone against major powers could leave us isolated.",
      midRight: "Major superpowers treat smaller allies as expendable pawns, expecting us to buy their weapons and join their wars with zero genuine loyalty.",
      bottomLeft: "Collective security alliances like ANZUS or NATO deter rogue states from invading peaceful nations; isolationism invites aggression.",
      bottomCenter: "Uphold our mutual defense treaties and intelligence-sharing partnerships; a small nation cannot defend vast maritime borders without trusted allies.",
      bottomRight: "If we abandon our allies when they need us, nobody will come to our rescue when our trade routes or borders are threatened."
    },

    // CONTROLE ECONOMICO
    controle_01: {
      topLeft: "National planning in energy, housing, and domestic manufacturing guarantees essential goods and prevents vulnerable citizens from falling into poverty.",
      topCenter: "Coordinate long-term state investments in power grid upgrades, public home building, and strategic steel and manufacturing production.",
      topRight: "Government planning in domestic energy and housing stops corporate monopolists from price-gouging our power bills and rent.",
      midLeft: "Strategic guidance makes sense for national lifelines like power and water, provided general consumer industries remain free to innovate.",
      center: "I don't know / Not sure — affordable housing and power need government intervention, but central planning often leads to bureaucratic delays.",
      midRight: "State planning sounds orderly on paper, but government bureaucrats are terrible at forecasting supply and usually create costly white elephants.",
      bottomLeft: "Heavy-handed state planning suffocates private enterprise, creates chronic shortages, and misallocates billions in taxpayer capital.",
      bottomCenter: "Let prices, consumer demand, and competitive investment direct capital efficiently rather than politicized five-year plans.",
      bottomRight: "Every time politicians try to plan economic sectors, taxpayers get stuck paying for botched projects while political cronies walk away with grants."
    },
    controle_02: {
      topLeft: "Market-driven prices and wages balance supply and demand naturally, rewarding productive work and ensuring goods are priced efficiently for all.",
      topCenter: "Remove price ceilings and rigid wage indexing so businesses can hire flexibly and prices adjust to real resource scarcity.",
      topRight: "Skilled workers and competitive small businesses should be free to negotiate their own rates without government caps limiting what they can earn.",
      midLeft: "Market pricing works best for most goods, but a statutory minimum wage and emergency price caps are necessary during cost-of-living spikes.",
      center: "I don't know / Not sure — price controls can cause shortages, but without minimum wages and caps, greedy corporations gouge everyday people.",
      midRight: "Big business bosses love preaching 'free markets' until their own companies face failure, then they run straight to government for bailouts.",
      bottomLeft: "Unregulated wages and prices leave low-income families at the mercy of monopoly landlords and grocery giants, driving poverty and inequality.",
      bottomCenter: "Maintain legally binding minimum wages, fair work standards, and consumer price watchdogs to ensure economic stability and dignity.",
      bottomRight: "Without a strong legal minimum wage, unscrupulous bosses will exploit workers, underpay vulnerable staff, and drive living standards into the dirt."
    },
    controle_03: {
      topLeft: "Interest rates directly shape unemployment, housing costs, and national wellbeing; economic policy must be accountable to the elected parliament.",
      topCenter: "Direct the central bank to coordinate interest rate decisions with national housing, employment, and infrastructure investment goals.",
      topRight: "Unelected central bankers keep jacking up interest rates and crushing family mortgages; politicians we vote for should rein them in.",
      midLeft: "Democratic input on long-term monetary goals is healthy, provided politicians don't interfere in monthly technical interest rate decisions.",
      center: "I don't know / Not sure — central bankers seem out of touch with working families, but giving politicians money-printing powers could trigger hyperinflation.",
      midRight: "Politicians blame the central bank for high rates, but high interest rates are mostly caused by wasteful government overspending in the first place.",
      bottomLeft: "Allowing politicians to control interest rates leads to politically-timed rate cuts before elections, causing runaway inflation and currency collapse.",
      bottomCenter: "Central bank independence is crucial to anchor inflation expectations, maintain credit ratings, and protect the purchasing power of savings.",
      bottomRight: "If politicians gain control over the money supply, they will print endless cash to buy votes, debasing our hard-earned savings and pensions."
    },

    // COMERCIO
    comercio_01: {
      topLeft: "Safeguarding domestic manufacturing, farming, and green industry with tariffs preserves vital national skills and economic resilience.",
      topCenter: "Impose strategic tariffs on subsidized foreign imports to maintain domestic steel, agricultural, and component manufacturing capacity.",
      topRight: "Tariffs protect local factories, farms, and trade jobs from being destroyed by cheap foreign imports made with exploited labor.",
      midLeft: "Targeted tariffs make sense to protect infant green industries, but broad blanket tariffs risk driving up costs for everyday consumers.",
      center: "I don't know / Not sure — protecting local manufacturing jobs is vital, but tariffs also make everyday electronics and cars more expensive.",
      midRight: "Tariffs usually end up propping up lazy local corporate monopolies that charge high prices for shoddy products because they face no competition.",
      bottomLeft: "Trade protectionism triggers retaliatory tariffs from overseas partners, wrecking our export industries and raising the cost of living for everyone.",
      bottomCenter: "Support rules-based trade through international agreements, resolving unfair subsidies via anti-dumping tribunals rather than unilateral tariff walls.",
      bottomRight: "Tariffs are just a hidden sales tax on working families, forcing everyday consumers to pay inflated prices for essentials to protect favored lobby groups."
    },
    comercio_02: {
      topLeft: "Zero tariffs lower prices on food, technology, and building materials for all citizens, while forcing domestic companies to innovate and compete globally.",
      topCenter: "Phase out import duties across consumer goods and industrial inputs to lower manufacturing and living costs across the whole economy.",
      topRight: "Lower tariffs mean cheaper cars, cheaper tools, and cheaper groceries for our households, stretching everyday paychecks further.",
      midLeft: "Free trade delivers lower prices, provided governments assist workers displaced by foreign competition with retraining and adjustment support.",
      center: "I don't know / Not sure — cheap imports are great for household budgets, but losing all our local manufacturing capacity feels risky.",
      midRight: "Free trade deals are negotiated by multinational corporate lobbyists who outsource local jobs to sweatshops while executives pocket massive bonuses.",
      bottomLeft: "Wiping out domestic manufacturing leaves the nation completely dependent on fragile foreign supply chains that collapse during global crises.",
      bottomCenter: "Maintain strategic industrial capabilities in food, defense, and medicine; a country that cannot feed or equip itself cannot defend its sovereignty.",
      bottomRight: "Unchecked unilateral free trade throws local blue-collar workers onto the scrapheap, gutting regional communities so big retailers can maximize margins."
    },
    comercio_03: {
      topLeft: "Supporting local workers and domestic manufacturing builds social cohesion and stable communities, which is worth paying slightly more for.",
      topCenter: "Apply targeted import quotas and government procurement rules that mandate buying locally made steel, concrete, and uniforms.",
      topRight: "I'd rather pay an extra few dollars for goods if it means our mates and our kids can get secure manufacturing apprenticeships and jobs.",
      midLeft: "Protecting key industries is noble, but price inflation must be monitored so poorer families aren't priced out of basic everyday goods.",
      center: "I don't know / Not sure — keeping local jobs is important, but with inflation already crushing households, deliberately raising prices hurts.",
      midRight: "Politicians promise import limits will save jobs, but local factory owners usually pocket the protected profits and automate the assembly line anyway.",
      bottomLeft: "Artificially restricting imports drives up inflation, increases construction costs for hospitals and schools, and triggers retaliatory trade bans.",
      bottomCenter: "Support industrial competitiveness through research, cheap domestic energy, and skilled training rather than closing borders to trade.",
      bottomRight: "Working families are already struggling to afford groceries and rent; forcing them to pay higher prices for protected goods is completely unfair."
    },

    // RELIGIAO
    religiao_01: {
      topLeft: "A secular state guarantees that citizens of all faiths and backgrounds are treated equally under the law without religious favoritism.",
      topCenter: "Enact strict separation of church and state so public policy, healthcare, and education are decided purely by evidence and civic need.",
      topRight: "Religious dogmas shouldn't dictate how I live my life, what medical care I receive, or how my family chooses to live.",
      midLeft: "Faith communities do great charitable work, but their private beliefs shouldn't be imposed as universal law on everyone else.",
      center: "I don't know / Not sure — keeping religion out of government makes sense, but many people's deepest moral values come from their faith.",
      midRight: "Politicians and lobbyists only trot out religious talk to divide voters and dodge real questions about public services and cost of living.",
      bottomLeft: "Erasing religious principles from public life discards centuries of moral wisdom on charity, human dignity, and care for the vulnerable.",
      bottomCenter: "Preserve our constitutional traditions and legal heritage, which were built on shared moral values, without discriminating against minorities.",
      bottomRight: "Aggressive secularism is just trying to push traditional believers out of the public square and silence people who hold deep moral convictions."
    },
    religiao_02: {
      topLeft: "When public leaders are guided by deep spiritual morality, they govern with genuine humility, compassion, and concern for the weak.",
      topCenter: "Encourage faith-based charities, community groups, and moral leaders to take an active role in shaping social programs and public welfare.",
      topRight: "My religious faith gives me an unshakeable moral compass to protect my family and community from corruption and moral decay.",
      midLeft: "Personal faith is a great foundation for personal integrity, provided leaders still govern fairly for people of all beliefs.",
      center: "I don't know / Not sure — faith inspires people to do good, but using religion to decide politics often leads to conflict.",
      midRight: "Too many politicians wrap themselves in religion just to look righteous while voting against the interests of working people.",
      bottomLeft: "Using religious doctrine to dictate public policy creates sectarian division, intolerance, and exclusion in a diverse society.",
      bottomCenter: "Democratic governance must be based on universal human rights, scientific evidence, and secular law, not religious dogma.",
      bottomRight: "I don't want religious zealots or church hierarchies telling me how to vote, how to raise my kids, or how to live my life."
    },
    religiao_03: {
      topLeft: "Laws must protect every citizen equally, ensuring that no single religious group can use state power to dominate others.",
      topCenter: "Draft legislation and judicial standards solely on secular human rights, constitutional principles, and objective public benefit.",
      topRight: "Neutral laws protect my freedom of conscience so nobody else can force their dietary, cultural, or religious rules on my household.",
      midLeft: "Religious traditions helped shape our basic concepts of justice, but statutory laws today need to be neutral for everyone.",
      center: "I don't know / Not sure — laws should be fair to all, but whether any law can ever be completely neutral on moral questions is debatable.",
      midRight: "Claiming laws are neutral is usually an excuse for corporate and bureaucratic elites to replace traditional ethics with whatever suits their interests.",
      bottomLeft: "Pretending laws are value-neutral erodes the moral duties we owe each other, reducing society to cold legal contracts and commercial transactions.",
      bottomCenter: "Respect our common law foundations, which developed out of Christian traditions of justice and individual accountability, while protecting civil liberties.",
      bottomRight: "Neutral laws often end up trampling on religious freedoms, forcing faith-based schools, hospitals, and charities to violate their own beliefs."
    },

    // MORAL
    moral_01: {
      topLeft: "Every child in foster care deserves a loving, stable home; giving loving same-sex couples equal adoption rights gives more kids a chance at a great life.",
      topCenter: "Update adoption regulations and screening processes to evaluate prospective parents strictly on safety, love, and stability, regardless of sexual orientation.",
      topRight: "Loving couples have an equal right to build a family through adoption without facing discrimination from the government.",
      midLeft: "What matters most is a safe and supportive home, though adoption services must always keep the child's individual needs as the top priority.",
      center: "I don't know / Not sure — providing loving homes for orphans is essential, but people hold strong views about the traditional family structure.",
      midRight: "Adoption agencies should focus purely on the welfare of vulnerable kids rather than getting caught up in cultural culture wars.",
      bottomLeft: "Children have a natural right and developmental need for both a mother and a father; adoption policy should preserve this balance wherever possible.",
      bottomCenter: "Preserve the traditional family model in family law and adoption policy as the proven historical foundation for raising children.",
      bottomRight: "Forcing faith-based adoption agencies to violate their religious tenets or shut down deprives vulnerable children of experienced care."
    },
    moral_02: {
      topLeft: "Strong, stable two-parent families provide the most resilient environment for raising happy, healthy children and building a stable society.",
      topCenter: "Provide targeted family tax benefits, parental leave, and marriage support programs to help couples stay together and raise children.",
      topRight: "Preserving traditional family values gives my kids stability, moral boundaries, and strong roots to rely on throughout life.",
      midLeft: "A stable two-parent household is a wonderful ideal, provided we don't look down on or penalize single parents doing their absolute best.",
      center: "I don't know / Not sure — strong families are the bedrock of any community, but families come in all shapes and sizes today.",
      midRight: "Politicians lecture working people about family values while passing economic policies that make housing and childcare completely unaffordable.",
      bottomLeft: "Insisting on a rigid traditional family model alienates single parents, foster carers, and blended families who do incredible work raising kids.",
      bottomCenter: "Support all families through equal access to healthcare, education, and childcare, without judging family structures.",
      bottomRight: "Governments and moralizers have no business telling people what their households should look like or meddling in private family lives."
    },
    moral_03: {
      topLeft: "Treating every person with basic human dignity and accepting who they are creates a kinder, safer, and more inclusive community for all.",
      topCenter: "Update identification documents, anti-discrimination laws, and public facilities to respect individuals' declared gender identity.",
      topRight: "People should be free to live their authentic lives without being harassed, bullied, or denied everyday services by strangers.",
      midLeft: "Everyone deserves courtesy and respect in daily life, though balancing this with fair competition in sports and privacy requires care.",
      center: "I don't know / Not sure — treating people with respect is basic decency, but there are complex debates around sports categories and young people.",
      midRight: "Corporate HR departments and politicians push performative identity campaigns to look progressive while ignoring wages and job security.",
      bottomLeft: "Ignoring biological sex undermines hard-won protections for women's sports, female-only spaces, and evidence-based medicine.",
      bottomCenter: "Base public records, athletic categories, and medical regulations on biological sex, while ensuring legal protections against unjust discrimination.",
      bottomRight: "Nobody should be threatened with fines or losing their job by bureaucratic speech codes just for stating biological facts."
    },

    // TECNOLOGIA
    tecnologia_01: {
      topLeft: "Technological breakthroughs and industrial capabilities are what cure diseases, lift people out of poverty, and solve global challenges like clean energy.",
      topCenter: "Invest heavily in national research facilities, advanced manufacturing, and engineering training to drive rapid technological progress.",
      topRight: "Building high-tech industries creates high-paying trade and engineering jobs for our kids, keeping our local economy competitive.",
      midLeft: "Innovation drives human progress, but we need guardrails so fast development doesn't destroy natural ecosystems or local communities.",
      center: "I don't know / Not sure — technological advancement has made life much easier, but unchecked industrial growth creates serious pollution and stress.",
      midRight: "Tech hype usually promises a futuristic paradise, but mostly delivers apps that track our data and gadgets designed to break in two years.",
      bottomLeft: "Obsessive industrial expansion exploits finite natural resources, pollutes water and air, and accelerates catastrophic climate destruction.",
      bottomCenter: "Balance technological investment with strict environmental protection, preserving our natural heritage and biodiversity for future generations.",
      bottomRight: "Mega-industrial projects usually tear up rural communities and pollute local waterways while multinational corporations ship all the profits overseas."
    },
    tecnologia_02: {
      topLeft: "A lifestyle grounded in nature, physical activity, and close community promotes genuine mental wellbeing and ecological harmony for society.",
      topCenter: "Encourage regenerative local farming, outdoor recreation, and screen-free community spaces to reconnect people with the natural world.",
      topRight: "Stepping off the digital treadmill to live simply and spend time outdoors gives me and my family real peace of mind and health.",
      midLeft: "Spending more time in nature is great for everyone's health, though modern medicine and communication are still lifesavers.",
      center: "I don't know / Not sure — slowing down and getting away from screens sounds wonderful, but modern amenities make daily life so much easier.",
      midRight: "Romanticizing off-grid living is an expensive luxury for wealthy influencers who don't have to worry about earning a real living.",
      bottomLeft: "Abandoning technological development would reverse modern sanitation, disease prevention, and agricultural yields, causing mass hardship.",
      bottomCenter: "Rely on modern infrastructure, high-tech power grids, and advanced logistics to maintain the living standards and security of the entire population.",
      bottomRight: "Anti-tech nostalgia ignores the fact that working families rely on modern tools, affordable electricity, and vehicles just to make ends meet."
    },
    tecnologia_03: {
      topLeft: "Automating dangerous, dull, and repetitive labor increases national productivity, lowers costs for essentials, and frees people to do meaningful creative work.",
      topCenter: "Accelerate automation in manufacturing and logistics while funding worker retraining and sharing productivity dividends through public services.",
      topRight: "Adopting AI tools and smart machinery lets our local businesses work faster, stay competitive, and cut down on tedious busywork.",
      midLeft: "AI and automation can do wonders for productivity, provided displaced workers are given genuine support rather than tossed aside.",
      center: "I don't know / Not sure — previous technology created more jobs than it replaced, but AI is advancing so fast that it's hard to predict the impact.",
      midRight: "Corporate executives don't care about human progress; they are rushing to deploy AI simply to slash payrolls and pump their stock options.",
      bottomLeft: "Mass automation threatens to destroy middle-class careers, gut local economies, and concentrate obscene wealth in the hands of a few tech monopolies.",
      bottomCenter: "Regulate AI and automation deployment with strict labor protections, transition timelines, and licensing safeguards to preserve social stability.",
      bottomRight: "Working people shouldn't have their livelihoods stolen by algorithms so tech billionaires can get even richer while leaving the rest of us with nothing."
    }
  },

  pt: {
    economia_10: {
      willBe: "O dever cívico e a solidariedade comunitária devem substituir a coerção estatal; as pessoas contribuem mais quando doam por propósito compartilhado.",
      cantBe: "Ganhei meu dinheiro e tenho o direito de mantê-lo; não devo ser forçado a financiar burocracias ou programas que não me beneficiam.",
      mayBe: "A tributação obrigatória é indispensável para manter hospitais, estradas e seguridade social; a contribuição voluntária colapsaria os serviços públicos.",
      wontBe: "Se os impostos fossem voluntários, apenas pessoas honestas pagariam enquanto os ricos e corruptos sonegariam tudo, explorando quem trabalha.",
      indifferent: "Não sei / Em dúvida; parece interessante na teoria, mas não sei como funcionaria na prática."
    },
    economia_02: {
      willBe: "A concorrência estimula a eficiência e reduz os custos; monopólios estatais tendem a se acomodar e prestar serviços ruins à população.",
      cantBe: "Permitir que empresas privadas e empreendedores disputem contratos quebra a burocracia estatal e cria oportunidades reais de negócios.",
      mayBe: "Serviços essenciais como água, saneamento e saúde existem para o bem público, não para lucro privado; privatizações costumam encarecer as tarifas.",
      wontBe: "Toda vez que privatizam um serviço essencial, as contas sobem e o atendimento ao cidadão comum piora.",
      indifferent: "Não sei / Em dúvida; depende muito de qual serviço estamos falando."
    },
    estrutura_01: {
      willBe: "Governos locais conhecem a realidade de sua população muito melhor do que burocratas de Brasília distantes do dia a dia.",
      cantBe: "Nosso município e as empresas locais devem ter autonomia para gerir seus recursos sem a tutela de burocratas federais.",
      mayBe: "Um país unido precisa de padrões, direitos e recursos iguais em todo o território; caso contrário, regiões mais pobres ficam desamparadas.",
      wontBe: "Nossos hospitais e serviços regionais dependem de verbas nacionais para funcionar; ficar por conta própria quebraria os municípios.",
      indifferent: "Não sei / Em dúvida; algumas questões devem ser locais, mas outras precisam de coordenação nacional."
    }
  }
};
