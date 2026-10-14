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
      topLeft: "People contribute generously when asked to pitch in freely, rather than forced.",
      topCenter: "Switch to user-pays so people only fund services they actually use.",
      topRight: "People earn their money and should decide where every dollar goes.",
      midLeft: "Voluntary giving is a great ideal, but hard to run a country on.",
      center: "Hard to know whether voluntary funding could keep public services running.",
      midRight: "Sounds nice in theory, but most people won't pay if they don't have to.",
      bottomLeft: "Voluntary funding would starve hospitals and schools, leaving vulnerable people stranded.",
      bottomCenter: "Compulsory taxes are necessary to guarantee reliable public infrastructure and services.",
      bottomRight: "The wealthy and dishonest would pay nothing, leaving honest workers carrying the load."
    },
    economia_01: {
      topLeft: "Break up corporate monopolies and extreme wealth to give everyone a fair go.",
      topCenter: "Bust monopolies and tax windfall profits to fund public infrastructure.",
      topRight: "The economy is rigged; busting billionaire cartels gives workers a decent cut.",
      midLeft: "Extreme inequality harms society, but violent upheaval causes massive suffering.",
      center: "Corporate monopolies are a huge problem, but violent upheaval usually makes life worse.",
      midRight: "Taking down big business sounds heroic, but socialist overhauls end up mismanaged by bureaucrats.",
      bottomLeft: "Violent revolution destroys social trust and leads to dictatorship; reform must be peaceful.",
      bottomCenter: "Maintain rule of law and property rights; legal chaos scares investment and kills jobs.",
      bottomRight: "Radical wealth seizures always end up hurting small businesses and everyday families' savings."
    },
    economia_02: {
      topLeft: "Competition drives innovation and lowers costs compared to sleepy government monopolies.",
      topCenter: "Tender services to private bidders with strict penalties for poor performance.",
      topRight: "Private enterprise lets local contractors compete instead of locking jobs behind government red tape.",
      midLeft: "Market competition works for consumer goods, but healthcare and power need public guarantees.",
      center: "Competitive transport can work well, but privatizing water or emergency care is risky.",
      midRight: "Big corporations usually form cartels and buy off regulators to kill real competition.",
      bottomLeft: "Public services exist to help people; privatization cuts corners and sacks workers for profit.",
      bottomCenter: "Core utilities should be run by public authorities to ensure reliable, equal access.",
      bottomRight: "Every time politicians sell off assets, utility bills jump and customer service drops."
    },
    economia_03: {
      topLeft: "Key infrastructure like power grids and ports are vital to security and must stay public.",
      topCenter: "Keep public ownership of critical infrastructure so foreign corporations cannot control national assets.",
      topRight: "Public ownership of strategic assets protects local jobs and stops monopolies price-gouging households.",
      midLeft: "Public ownership makes sense for vital lifelines, but everyday businesses run better privately.",
      center: "Energy grids should stay public, but defining what counts as 'strategic' is tricky.",
      midRight: "State-owned companies usually end up bloated, inefficient, and bleeding taxpayer cash.",
      bottomLeft: "Private businesses innovate faster and take commercial risks without taxpayers footing the bill.",
      bottomCenter: "Governments should enforce safety regulations, leaving commercial operations to private specialists.",
      bottomRight: "State monopolies become protected clubs for political mates, funded by our taxes."
    },

    // ESTRUTURA
    estrutura_01: {
      topLeft: "Local councils know their communities best and should run their own affairs.",
      topCenter: "Transfer power to local councils, reserving national government for cross-border issues.",
      topRight: "Let our town make its own decisions without distant bureaucrats telling us how to live.",
      midLeft: "Local decision-making is great, but poorer regions need national funding to survive.",
      center: "Hard to separate what locals know best from what needs national coordination.",
      midRight: "Local control sounds good, but small councils often get captured by petty politics.",
      bottomLeft: "National standards ensure every citizen has equal rights and quality services anywhere in the country.",
      bottomCenter: "Maintain national coordination; leaving major policies to scattered councils creates chaotic rules.",
      bottomRight: "Our regional services depend on federal funding; pushing away Canberra would leave us broke."
    },
    estrutura_02: {
      topLeft: "Every citizen deserves identical rights and legal protections across the entire country.",
      topCenter: "Standardize laws nationally so regulations and penalties are identical everywhere.",
      topRight: "One national rulebook makes it simpler to run a business and move for work.",
      midLeft: "Uniform laws ensure equality, but remote regions have unique needs national rules often ignore.",
      center: "Criminal laws should be uniform, but local planning and customs may need regional flexibility.",
      midRight: "Central politicians usually pass laws that suit capital cities while ignoring regional realities.",
      bottomLeft: "Regions have distinct cultures; forcing a one-size-fits-all legal system on communities is wrong.",
      bottomCenter: "Regions should keep the right to pass local laws based on their own conditions.",
      bottomRight: "Distant politicians shouldn't overrule our regional laws and force rules we voted against."
    },
    estrutura_03: {
      topLeft: "Locals know their community best; letting councils make local bylaws keeps government accountable.",
      topCenter: "Pass local bylaws so parking, amenities, and town planning are resolved quickly.",
      topRight: "Our town should set local business rules without being strangled by big-city regulations.",
      midLeft: "Local lawmaking is practical, but small councils often lack legal expertise to draft sound rules.",
      center: "Zoning and parking are local matters, but building standards need broader oversight.",
      midRight: "Small councils are notorious for petty politics and favoring their mates over residents.",
      bottomLeft: "Crucial safety, health, and tenant standards must be set nationally to protect vulnerable people.",
      bottomCenter: "Maintain statewide legal consistency; dozens of conflicting local bylaws create costly confusion.",
      bottomRight: "Local councils already waste rates; giving them more bylaw power just brings more fines."
    },
    estrutura_04: {
      topLeft: "Every child deserves the same high-quality education, regardless of their postcode.",
      topCenter: "Standardize core math and literacy nationwide so moving states doesn't disrupt schooling.",
      topRight: "A single national curriculum ensures qualifications are recognized everywhere for jobs and university.",
      midLeft: "National benchmarks are useful, but teachers need flexibility to suit local student needs.",
      center: "Core subjects like math should be national, but local history and vocational training can vary.",
      midRight: "Centralized curriculums get hijacked by whichever party is in power pushing their ideological agenda.",
      bottomLeft: "Forcing a rigid national syllabus erases unique regional cultures and local community histories.",
      bottomCenter: "Regional education departments understand their local schools far better than distant bureaucrats.",
      bottomRight: "Parents and local schools should decide curriculum, not bureaucrats hundreds of miles away."
    },
    estrutura_05: {
      topLeft: "Letting states draft their own constitutions respects local democracy and diverse regional traditions.",
      topCenter: "Give states constitutional freedom to tailor their parliaments and courts to regional scale.",
      topRight: "Our state should govern its own affairs and tax base without central interference.",
      midLeft: "State constitutions make sense, provided they respect universal democratic rights for all citizens.",
      center: "States need administrative autonomy, but competing constitutions could fracture the country.",
      midRight: "Separate state constitutions allow local politicians to gerrymander and entrench power without checks.",
      bottomLeft: "A united country requires one constitution guaranteeing equal rights in every state.",
      bottomCenter: "Competing state constitutions create conflicting court systems, legal gridlock, and instability.",
      bottomRight: "Corrupt state politicians shouldn't be allowed to write discriminatory clauses into local constitutions."
    },

    // REPRESENTACAO
    representacao_01: {
      topLeft: "Voting is the only peaceful way citizens can hold power to account and remove bad leaders.",
      topCenter: "Protect ballot integrity and independent electoral commissions so citizens always have the final say.",
      topRight: "My vote forces politicians to listen to working people instead of unelected bureaucrats deciding for us.",
      midLeft: "Democratic elections are our best foundation, even if voters can be misled by media hype.",
      center: "Politicians are often disappointing, but scrapping elections usually leads straight to tyranny.",
      midRight: "Elections just offer a choice between two sets of party insiders who answer to corporate donors.",
      bottomLeft: "When a destructive government wrecks the country, waiting years for an election can cause irreversible damage.",
      bottomCenter: "Constitutional courts and independent institutions must have power to restrain reckless politicians when necessary.",
      bottomRight: "Uninformed mobs repeatedly vote in reckless governments that run up debts and jack up taxes on workers."
    },
    representacao_02: {
      topLeft: "In catastrophic emergencies, decisive leadership is vital to protect lives without paralysis.",
      topCenter: "Grant temporary emergency powers to coordinate disaster relief and rescue rapidly.",
      topRight: "In a crisis, a leader must cut red tape to protect our community.",
      midLeft: "Fast executive action is needed in a crisis, but requires parliamentary review afterward.",
      center: "Speed matters in a disaster, but giving one leader unchecked power is risky.",
      midRight: "Politicians routinely hype up emergencies just to grab powers they never give back.",
      bottomLeft: "Concentrating power in one person invites tyranny; parliamentary oversight exists to prevent abuses.",
      bottomCenter: "The constitution must never be sidelined; judicial checks are our main defense against autocracy.",
      bottomRight: "When leaders rule by decree, ordinary people lose rights and dissent gets crushed."
    },
    representacao_03: {
      topLeft: "Criticizing leaders in public exposes incompetence and keeps government honest.",
      topCenter: "Protect investigative journalism so ministers face hard questions on their records.",
      topRight: "I have every right to call out bad policies that hurt my family.",
      midLeft: "Criticism is healthy for democracy, though constant smear campaigns erode public trust.",
      center: "Free speech is vital, but politicians often use it to spread division.",
      midRight: "Opposition politicians don't care about accountability; they just score cheap political points.",
      bottomLeft: "During wartime or national emergencies, destructive political attacks undermine national security.",
      bottomCenter: "Opposition must follow parliamentary rules; reckless disinformation that undermines institutions should be checked.",
      bottomRight: "Hostile factions shouldn't be allowed to weaponize slander to destabilize the country."
    },

    // PODER / LEI E ORDEM
    poder_01: {
      topLeft: "Communities deserve safety; stopping violent gangs protects local families and businesses.",
      topCenter: "Deploy coordinated police taskforces to dismantle crime syndicates and seize weapons.",
      topRight: "Clean out violent thugs so my family can walk our streets in peace.",
      midLeft: "Strong policing against crime is necessary, but officers must respect basic human rights.",
      center: "Gangs must be stopped, but aggressive raids often catch innocent bystanders.",
      midRight: "Heavy-handed raids make headlines, but cops usually harass petty offenders while bosses walk.",
      bottomLeft: "Militarized police terrorize suburbs and don't fix the underlying poverty driving crime.",
      bottomCenter: "Rely on judicial oversight, intelligence investigations, and youth programs rather than paramilitary policing.",
      bottomRight: "With blank-check powers, innocent working people get pulled over and treated like criminals."
    },
    poder_02: {
      topLeft: "Adults should be free to choose; decriminalisation redirects police to violent crime.",
      topCenter: "Tax and regulate adult cannabis like alcohol, funding healthcare and mental health.",
      topRight: "I should be able to unwind after work without fear of criminal records.",
      midLeft: "Decriminalising personal use makes sense, provided drug driving is strictly policed.",
      center: "Treating cannabis as a crime seems excessive, but commercial sales could increase dependency.",
      midRight: "Legalisation mostly creates corporate drug cartels and more public health bills.",
      bottomLeft: "Widespread cannabis use increases youth mental illness, putting massive pressure on hospitals.",
      bottomCenter: "Maintain prohibition to send a clear message that illicit drugs harm public health.",
      bottomRight: "Keep drug smoke and dealers away from our kids and local parks."
    },
    poder_03: {
      topLeft: "Targeted surveillance stops terrorist plots and child abuse networks before innocents get hurt.",
      topCenter: "Require judicial warrants for security agencies to intercept encrypted criminal communications.",
      topRight: "Law enforcement should have the tools to track down violent predators in our communities.",
      midLeft: "Tracking extremists is reasonable, but surveillance must be limited to serious crimes.",
      center: "Catching serious criminals is essential, but mass automated snooping invades privacy.",
      midRight: "Agencies say surveillance protects us, but always end up monitoring political rivals.",
      bottomLeft: "Mass digital snooping destroys privacy and treats every law-abiding citizen as a suspect.",
      bottomCenter: "Protect encryption and constitutional privacy; undermining secure communication exposes national infrastructure.",
      bottomRight: "Government departments leak data constantly; giving them our private messages invites blackmail."
    },

    // IMIGRACAO
    imigracao_01: {
      topLeft: "A shared language and common values build trust and social cohesion in a democracy.",
      topCenter: "Provide free language and civics classes so new arrivals can integrate into work.",
      topRight: "Learning the language and local customs makes daily work and neighborhood life easy.",
      midLeft: "Learning the common language is practical, but families should maintain their heritage at home.",
      center: "Speaking the common language helps with work, but forcing cultural conformity feels wrong.",
      midRight: "Politicians demand integration while failing to fund basic English classes for migrants.",
      bottomLeft: "Forcing cultural conformity erases rich heritages and alienates migrant communities.",
      bottomCenter: "Laws should protect cultural freedom and diversity, not enforce state-mandated conformity.",
      bottomRight: "Nobody should have their culture or traditions dictated by politicians scoring nationalist points."
    },
    imigracao_02: {
      topLeft: "Multilingual public services ensure non-English speakers can access courts and healthcare with dignity.",
      topCenter: "Fund translation in hospitals and courts so vital emergency services remain accessible to all.",
      topRight: "Multilingual skills give our kids and local businesses huge advantages in world trade.",
      midLeft: "Multilingual services help people in need, provided a shared national language unites civic life.",
      center: "Translating emergency services is vital, but having no common language could divide communities.",
      midRight: "Agencies waste millions on token translation rather than helping people learn the common language.",
      bottomLeft: "Without a common language, society fractures into isolated enclaves with little mutual trust.",
      bottomCenter: "Maintain one official language for courts, schools, and government to safeguard national unity.",
      bottomRight: "Public services and signs should be in our common language so everyone can understand."
    },
    imigracao_03: {
      topLeft: "Pausing rapid immigration relieves strain on housing, hospitals, and schools.",
      topCenter: "Cap migration numbers and tie annual intakes directly to housing and hospital capacity.",
      topRight: "Pausing high migration stops landlords hiking rents and protects wages from being undercut.",
      midLeft: "Slowing intake makes sense during a housing crisis, though skilled workers are needed.",
      center: "High migration strains housing, but shutting the border could hurt hospitals and farms.",
      midRight: "Corporations lobby for high migration simply to keep wages low and rents high.",
      bottomLeft: "Shutting borders deprives hospitals of nurses and abandons our humanitarian commitments to refugees.",
      bottomCenter: "Modern economies depend on global talent; closed borders lead to economic stagnation.",
      bottomRight: "Blaming migrants for housing shortages is a cheap distraction from government underfunding."
    },

    // DIPLOMACIA
    diplomacia_01: {
      topLeft: "A credible defense force deters aggressive regimes and protects peaceful shipping routes for all.",
      topCenter: "Equip defense forces with modern patrol vessels, air defense, and cyber security.",
      topRight: "A strong defense stops foreign bullies pushing us around and protects our trade.",
      midLeft: "A capable military is necessary insurance, but diplomacy and aid build lasting security.",
      center: "We must defend our borders, but pouring billions into weapons while hospitals struggle hurts.",
      midRight: "Bloated defense budgets enrich foreign arms makers without making our towns any safer.",
      bottomLeft: "Stockpiling offensive weapons fuels regional arms races and diverts cash from schools.",
      bottomCenter: "True security is built through multilateral treaties and regional cooperation, not sabre-rattling.",
      bottomRight: "We shouldn't waste tax dollars on foreign weapons that drag us into overseas conflicts."
    },
    diplomacia_02: {
      topLeft: "War brings devastation; every diplomatic avenue must be exhausted to protect human life.",
      topCenter: "Use multilateral mediators and diplomatic sanctions to resolve disputes before considering military force.",
      topRight: "Exhausting diplomacy keeps our troops safe from dying in unnecessary foreign quagmires.",
      midLeft: "Diplomacy must come first, but talks need credible strength if the opponent acts maliciously.",
      center: "Diplomacy should be tried first, but ruthless dictators often use talks to buy time.",
      midRight: "Diplomatic summits are mostly photo-ops for politicians while hostile troops mobilize anyway.",
      bottomLeft: "Endless negotiation with aggressive invaders gives them time to entrench and commit atrocities.",
      bottomCenter: "Military readiness is essential; an invading force won't be stopped by polite diplomatic letters.",
      bottomRight: "Appeasement only emboldens hostile regimes; dropping our guard leaves our country vulnerable."
    },
    diplomacia_03: {
      topLeft: "Neutralizing an imminent attack before missiles launch protects millions of innocent civilian lives.",
      topCenter: "Authorize targeted strikes only against confirmed imminent launch sites under strict intelligence proof.",
      topRight: "If an enemy aims missiles at our cities, we should hit them first.",
      midLeft: "Self-defense is legitimate, but striking first without international backing sets a dangerous precedent.",
      center: "Stopping a missile strike makes sense, but flawed intelligence could trigger an accidental war.",
      midRight: "Governments often fabricate claims of imminent threats to justify illegal invasions.",
      bottomLeft: "Preemptive strikes normalize aggression and drag nations into bloody conflicts based on dodgy intelligence.",
      bottomCenter: "Military force is lawful only in response to an actual attack or UN authorization.",
      bottomRight: "Warmongering politicians shouldn't drag our soldiers into foreign wars based on cooked dossiers."
    },

    // INTERVENCAO
    intervencao_01: {
      topLeft: "Every nation has the right to self-determination; foreign invasions always cause chaos and deaths.",
      topCenter: "Enforce strict non-intervention treaties and ban covert meddling in other nations' affairs.",
      topRight: "Our country should mind its own business instead of wasting soldiers and money abroad.",
      midLeft: "Non-intervention is the right baseline, with rare exceptions when regimes commit genocide.",
      center: "Foreign meddling usually backfires, but watching dictators slaughter innocent civilians feels wrong.",
      midRight: "Superpowers don't intervene for democracy; they invade to grab oil, minerals, and contracts.",
      bottomLeft: "The international community has a moral duty to remove tyrants who commit mass atrocities.",
      bottomCenter: "Democratic nations should use coordinated sanctions to isolate illegitimate military regimes.",
      bottomRight: "Allowing aggressive dictatorships to crush freedom abroad creates rogue states that threaten our trade."
    },
    intervencao_02: {
      topLeft: "A government's primary duty is protecting its citizens; applying diplomatic pressure abroad secures safety.",
      topCenter: "Use targeted sanctions and trade leverage to protect critical shipping routes and supply chains.",
      topRight: "When foreign competitors dump goods or steal tech, our government must push back hard.",
      midLeft: "Defending national interests is reasonable, provided pressure follows trade rules and avoids bullying.",
      center: "We must defend our interests, but aggressive sanctions can trigger trade wars that hurt consumers.",
      midRight: "Politicians talk about national interest when really they're serving corporate mining and defense lobbies.",
      bottomLeft: "Economic sanctions hurt innocent everyday families in foreign countries while corrupt elites stay rich.",
      bottomCenter: "International disputes should be resolved through binding arbitration, not unilateral economic bullying.",
      bottomRight: "Aggressive trade pressure backfires when foreign powers retaliate by sanctioning our farmers."
    },
    intervencao_03: {
      topLeft: "Foreign military entanglements drag peaceful countries into overseas conflicts that don't defend our shores.",
      topCenter: "Maintain an independent defense posture focused strictly on territorial defense rather than foreign wars.",
      topRight: "Our troops should only defend our own country, not fight in superpower proxy wars.",
      midLeft: "Avoiding foreign wars is sensible, but standing alongside democratic allies deters rogue aggression.",
      center: "Alliances can pull us into foreign wars, but going alone against superpowers leaves us isolated.",
      midRight: "Superpowers treat smaller allies as pawns, expecting us to buy weapons and join their wars.",
      bottomLeft: "Collective defense alliances like NATO deter rogue states from invading peaceful nations.",
      bottomCenter: "Uphold defense treaties; a small nation cannot defend vast borders without trusted allies.",
      bottomRight: "If we abandon allies when they need help, nobody will help us if we're attacked."
    },

    // CONTROLE ECONOMICO
    controle_01: {
      topLeft: "Public planning in energy and housing guarantees essentials and keeps families out of poverty.",
      topCenter: "Coordinate long-term public investments in power grids, public housing, and domestic manufacturing.",
      topRight: "State planning in energy and housing stops corporate monopolies price-gouging power bills and rent.",
      midLeft: "Government planning makes sense for power and water, provided general consumer markets stay competitive.",
      center: "Affordable housing needs government intervention, but central planning often leads to bureaucratic delays.",
      midRight: "State planning sounds neat on paper, but bureaucrats are terrible at forecasting supply.",
      bottomLeft: "Heavy-handed state planning suffocates enterprise, creates shortages, and wastes taxpayer capital.",
      bottomCenter: "Let market prices and consumer demand direct capital efficiently rather than politicized state plans.",
      bottomRight: "Every time politicians plan economic sectors, taxpayers foot the bill for botched projects."
    },
    controle_02: {
      topLeft: "Market wages and prices balance supply and demand naturally, rewarding hard work and innovation.",
      topCenter: "Remove rigid price caps so businesses can hire flexibly and adjust to real scarcity.",
      topRight: "Skilled workers and small businesses should negotiate their own rates without government limits.",
      midLeft: "Market pricing works for most goods, but minimum wages and emergency caps protect families.",
      center: "Price controls can cause shortages, but without minimum wages greedy corporations gouge people.",
      midRight: "Big businesses preach free markets until they fail, then rush to government for bailouts.",
      bottomLeft: "Unregulated wages and prices leave low-income families at the mercy of monopoly grocery giants.",
      bottomCenter: "Maintain legally binding minimum wages and consumer watchdogs to ensure economic fairness and stability.",
      bottomRight: "Without a legal minimum wage, unscrupulous bosses exploit workers and drag living standards down."
    },
    controle_03: {
      topLeft: "Interest rates directly shape jobs and housing costs; monetary policy must be democratically accountable.",
      topCenter: "Direct the central bank to coordinate interest rates with housing and employment goals.",
      topRight: "Unelected central bankers keep hiking rates and crushing mortgages; elected politicians should rein them in.",
      midLeft: "Democratic input on economic goals is good, provided politicians don't meddle in monthly rate hikes.",
      center: "Central bankers seem out of touch, but letting politicians print money risks runaway inflation.",
      midRight: "Politicians blame the central bank, but high inflation is driven by reckless government spending.",
      bottomLeft: "Letting politicians control interest rates causes pre-election rate cuts, runaway inflation, and economic ruin.",
      bottomCenter: "Central bank independence is vital to anchor inflation and protect the purchasing power of savings.",
      bottomRight: "If politicians control the money supply, they will print cash to buy votes, trashing our savings."
    },

    // COMERCIO
    comercio_01: {
      topLeft: "Tariffs on subsidized foreign imports protect local industry, skilled trades, and national resilience.",
      topCenter: "Impose strategic tariffs on subsidized foreign steel and farm goods to maintain domestic capacity.",
      topRight: "Tariffs protect local factories and farms from being destroyed by cheap foreign imports.",
      midLeft: "Tariffs help protect new green industries, but blanket duties drive up everyday prices.",
      center: "Protecting local manufacturing jobs is vital, but tariffs make electronics and cars more expensive.",
      midRight: "Tariffs prop up lazy domestic monopolies that charge inflated prices for shoddy goods.",
      bottomLeft: "Protectionism triggers retaliatory tariffs from trade partners, wrecking our export industries and jobs.",
      bottomCenter: "Resolve unfair foreign subsidies through international trade tribunals rather than unilateral tariff walls.",
      bottomRight: "Tariffs are a hidden tax on working families, making essentials expensive to protect favored lobbies."
    },
    comercio_02: {
      topLeft: "Zero tariffs lower prices on food and materials, while forcing domestic companies to innovate.",
      topCenter: "Phase out import duties on consumer goods to lower manufacturing and living costs across the economy.",
      topRight: "Lower tariffs mean cheaper cars, cheaper tools, and cheaper groceries for our households.",
      midLeft: "Free trade lowers prices, provided governments support workers displaced by foreign competition.",
      center: "Cheap imports stretch household budgets, but losing all our local manufacturing capacity feels risky.",
      midRight: "Free trade deals outsource local jobs to sweatshops while multinational executives pocket huge bonuses.",
      bottomLeft: "Wiping out domestic manufacturing leaves the nation dependent on fragile supply chains during crises.",
      bottomCenter: "Maintain strategic industrial capabilities in food and medicine; a nation that cannot equip itself isn't sovereign.",
      bottomRight: "Unilateral free trade throws local factory workers on the scrapheap to boost big retail profits."
    },
    comercio_03: {
      topLeft: "Supporting local manufacturing builds community stability, which is well worth paying slightly more for.",
      topCenter: "Mandate government procurement quotas to buy locally made steel, concrete, and equipment.",
      topRight: "I'd pay a few dollars extra if it keeps manufacturing apprenticeships and jobs local.",
      midLeft: "Protecting local industry is noble, provided price increases don't price poor families out of basics.",
      center: "Saving local jobs is important, but deliberately raising grocery prices hurts struggling families.",
      midRight: "Protected factory owners usually pocket government subsidies and automate the jobs anyway.",
      bottomLeft: "Restricting imports drives up inflation, increases hospital construction costs, and sparks trade bans.",
      bottomCenter: "Boost industrial competitiveness through cheap domestic energy and skills rather than trade walls.",
      bottomRight: "Families already struggle with high living costs; forcing them to pay higher protected prices is unfair."
    },

    // RELIGIAO
    religiao_01: {
      topLeft: "A secular state treats citizens of all faiths and backgrounds equally under the law.",
      topCenter: "Separate church and state so laws, healthcare, and education are based on evidence.",
      topRight: "Religious dogmas shouldn't dictate how I live, what healthcare I get, or my choices.",
      midLeft: "Religions do charitable work, but their private beliefs shouldn't be imposed as law on everyone.",
      center: "Keeping government secular makes sense, but many people's core morals stem from faith.",
      midRight: "Politicians just use religion to divide people and dodge questions on cost of living.",
      bottomLeft: "Removing religious ethics discards centuries of wisdom on charity, dignity, and caring for others.",
      bottomCenter: "Preserve our legal heritage and shared moral traditions without discriminating against any minority.",
      bottomRight: "Aggressive secularism pushes traditional believers out of public life and silences their convictions."
    },
    religiao_02: {
      topLeft: "Spiritual morality encourages leaders to govern with humility, compassion, and care for the weak.",
      topCenter: "Support faith-based charities and community groups taking an active role in social welfare.",
      topRight: "Personal faith gives me a clear moral compass to protect my family and community.",
      midLeft: "Faith builds personal integrity, provided leaders still govern fairly for people of all beliefs.",
      center: "Faith inspires people to do good, but using religion in politics causes conflict.",
      midRight: "Too many politicians wrap themselves in religion while voting against working people.",
      bottomLeft: "Using religious doctrine to dictate public policy creates sectarian division and intolerance.",
      bottomCenter: "Democratic governance must rest on human rights, evidence, and secular law, not dogma.",
      bottomRight: "Religious zealots shouldn't tell me how to vote, raise my kids, or live."
    },
    religiao_03: {
      topLeft: "Neutral laws ensure no single religious group can use government power to dominate others.",
      topCenter: "Base legislation solely on secular human rights, constitutional principles, and objective public benefit.",
      topRight: "Neutral laws protect my freedom of conscience from having other people's religious rules forced on me.",
      midLeft: "Religions helped shape ideas of justice, but statutory laws must be neutral for everyone.",
      center: "Laws should be fair to all, but whether any law is completely value-neutral is debatable.",
      midRight: "Claiming laws are neutral is usually an excuse for corporate elites to push their interests.",
      bottomLeft: "Pretending laws are value-neutral erodes moral duties, reducing society to cold commercial transactions.",
      bottomCenter: "Respect common law foundations developed from Christian traditions of justice and individual accountability.",
      bottomRight: "Neutral laws often trample religious freedoms, forcing faith-based charities to violate their beliefs."
    },

    // MORAL
    moral_01: {
      topLeft: "Every foster child deserves a loving home; equal adoption rights gives more kids a family.",
      topCenter: "Screen prospective adoptive parents strictly on safety, stability, and love, regardless of orientation.",
      topRight: "Loving couples have every right to build a family through adoption without government discrimination.",
      midLeft: "A safe, supportive home matters most, with the child's individual welfare as top priority.",
      center: "Providing loving homes for orphans is essential, but people hold strong traditional views.",
      midRight: "Adoption agencies should focus purely on child welfare instead of culture war politics.",
      bottomLeft: "Children have a developmental need for both a mother and father; adoption should reflect this.",
      bottomCenter: "Preserve the traditional family model in adoption law as the proven foundation for children.",
      bottomRight: "Forcing faith-based adoption agencies to violate religious tenets deprives vulnerable kids of care."
    },
    moral_02: {
      topLeft: "Stable two-parent families provide the most resilient environment for raising healthy children.",
      topCenter: "Provide family tax benefits and parental leave to help couples stay together and raise children.",
      topRight: "Traditional family values give my kids stability, moral boundaries, and strong roots in life.",
      midLeft: "Two-parent homes are a great ideal, provided we don't penalize single parents doing their best.",
      center: "Strong families are the bedrock of community, but families come in many shapes today.",
      midRight: "Politicians lecture about family values while passing policies that make housing and childcare unaffordable.",
      bottomLeft: "Insisting on a rigid family model alienates single parents and carers who do incredible work.",
      bottomCenter: "Support all families through equal access to healthcare, education, and childcare without moral judgment.",
      bottomRight: "Governments and moralizers have no business telling people what their private households should look like."
    },
    moral_03: {
      topLeft: "Treating every person with basic dignity and accepting who they are creates a safer community.",
      topCenter: "Update identification documents and public facilities to respect each person's declared gender identity.",
      topRight: "People should live their authentic lives without being harassed, bullied, or denied everyday services.",
      midLeft: "Everyone deserves everyday courtesy, though balancing privacy and fair sporting competition requires care.",
      center: "Respecting people is basic decency, but there are complex debates around sports and youth.",
      midRight: "Corporate HR and politicians push performative identity campaigns while ignoring real wages and jobs.",
      bottomLeft: "Ignoring biological sex undermines protections for women's sports, female-only spaces, and medical safeguards.",
      bottomCenter: "Base records, athletics, and medicine on biological sex while protecting people from unjust discrimination.",
      bottomRight: "Nobody should face fines or job losses under bureaucratic speech codes for stating biological facts."
    },

    // TECNOLOGIA
    tecnologia_01: {
      topLeft: "Technological breakthroughs cure diseases, lift living standards, and solve clean energy challenges.",
      topCenter: "Invest heavily in national research facilities and advanced manufacturing to drive technological progress.",
      topRight: "Building high-tech industries creates high-paying trade and engineering jobs for our kids.",
      midLeft: "Innovation drives progress, but guardrails are needed so rapid growth doesn't wreck ecosystems.",
      center: "Technology makes life easier, but unchecked industrial expansion causes serious pollution and stress.",
      midRight: "Tech hype promises a futuristic paradise, but mostly delivers data-tracking apps and disposable gadgets.",
      bottomLeft: "Obsessive industrial growth exploits finite resources, pollutes water, and accelerates catastrophic climate destruction.",
      bottomCenter: "Balance industrial investment with strict environmental protection, preserving our natural heritage for the future.",
      bottomRight: "Mega-industrial projects tear up rural communities and pollute waterways while corporations ship profits overseas."
    },
    tecnologia_02: {
      topLeft: "Living close to nature, physical activity, and community fosters genuine mental health and balance.",
      topCenter: "Encourage local farming, outdoor recreation, and screen-free community spaces to reconnect with nature.",
      topRight: "Stepping off the digital treadmill gives me and my family real peace of mind and health.",
      midLeft: "Spending time in nature is great for health, though modern medicine remains a lifesaver.",
      center: "Getting away from screens sounds wonderful, but modern amenities make daily life much easier.",
      midRight: "Romanticizing off-grid living is an expensive luxury for wealthy influencers who don't work real jobs.",
      bottomLeft: "Abandoning technology would reverse modern sanitation, disease prevention, and agriculture, causing mass poverty.",
      bottomCenter: "Modern infrastructure, high-tech power grids, and logistics are essential to maintain our living standards.",
      bottomRight: "Anti-tech nostalgia ignores that working families rely on modern tools and power to survive."
    },
    tecnologia_03: {
      topLeft: "Automating dangerous and dull labor boosts productivity, lowers living costs, and frees creative work.",
      topCenter: "Accelerate automation in manufacturing while funding worker retraining and sharing productivity dividends.",
      topRight: "Smart tools and AI help local businesses work faster, stay competitive, and cut tedious busywork.",
      midLeft: "Automation boosts productivity, provided displaced workers receive genuine retraining rather than being abandoned.",
      center: "Technology creates new industries, but AI is advancing so fast that job impacts are hard to predict.",
      midRight: "Corporate executives deploy AI simply to slash payrolls and pump their own stock bonuses.",
      bottomLeft: "Mass automation destroys middle-class careers, guts local towns, and concentrates wealth in tech monopolies.",
      bottomCenter: "Regulate automation with strict labor protections and transition timelines to preserve social stability.",
      bottomRight: "Workers shouldn't have livelihoods stolen by algorithms so tech billionaires get richer while we get nothing."
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
