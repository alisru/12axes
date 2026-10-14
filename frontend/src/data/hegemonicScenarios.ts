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
      willBe: "Wealth has become so concentrated in the hands of a few billionaires that only a radical overhaul can give everyday people a fair go.",
      cantBe: "The system is completely rigged against working blokes; taking down corporate monopolists is the only way people like us get our fair share.",
      mayBe: "Violent upheavals and revolutions always end in chaos, tyranny, and ruin; reforming the rules peacefully is the only way to protect society.",
      wontBe: "Every time radicals try to seize property, ordinary families and small businesses end up losing what little they've worked their whole lives to build.",
      indifferent: "I don't know / Not sure; inequality is crook, but bloody revolutions usually make things worse."
    },
    economia_02: {
      willBe: "Competition keeps everyone honest and brings prices down; government departments get lazy and sloppy when they hold a monopoly.",
      cantBe: "Let private businesses and local contractors bid for the work instead of locking everything behind government red tape.",
      mayBe: "Things like water, power, and healthcare should be run for the public good, not corporate profit. Private mobs just cut corners and jack up prices.",
      wontBe: "Every time they privatise an asset, our bills go through the roof and customer service goes down the toilet.",
      indifferent: "I don't know / Not sure; depends entirely on which service we're talking about."
    },
    economia_03: {
      willBe: "Essential infrastructure like power grids, ports, and water supplies must stay in public hands to guarantee national security and fair access for all.",
      cantBe: "Keeping strategic assets public stops foreign corporations from buying up our resources and gouging our local businesses on utility rates.",
      mayBe: "Private operators run commercial enterprises far more efficiently than state bureaucracies, freeing up taxpayer funds for real public needs.",
      wontBe: "Government-owned companies are just cash cows for lazy bureaucrats and union mates, funded directly out of our tax dollars.",
      indifferent: "I don't know / Not sure; some key assets should stay public, but other industries are better off private."
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
      willBe: "Even if voters elect clowns or duds, voting is the only way we get to sack them peacefully without burning the joint down.",
      cantBe: "I want my vote to count so politicians have to look working people in the eye, instead of some unelected elite dictating how we live.",
      mayBe: "When an incompetent government is driving the country off a cliff, waiting years for an election causes irreversible damage to the whole nation.",
      wontBe: "Idiots keep voting for corrupt politicians who jack up our taxes, wreck our jobs, and run down our local services.",
      indifferent: "I don't know / Not sure; politicians are mostly useless, but I don't know what you'd replace elections with that wouldn't end up worse."
    },
    representacao_02: {
      willBe: "During national emergencies, pandemics, or wars, strong executive leadership is vital to take decisive action without months of parliamentary bickering.",
      cantBe: "In a real crisis, I want a leader who can cut straight through bureaucratic roadblocks and fix the problem for my community immediately.",
      mayBe: "Concentrating absolute power in one person's hands always leads to tyranny; parliamentary checks and balances exist to protect citizen freedom.",
      wontBe: "Once you let a politician rule by decree, they never give that power back and they'll use it to crush anyone who stands up to them.",
      indifferent: "I don't know / Not sure; speed matters in an emergency, but giving a leader unchecked power is bloody risky."
    },
    representacao_03: {
      willBe: "Freedom to criticize the government in public is the cornerstone of a free society; exposing government failures keeps leaders honest.",
      cantBe: "The opposition has to be able to speak up so whistleblowers and everyday blokes who get screwed over by official decisions have a voice.",
      mayBe: "Constant partisan attacks and malicious rumors undermine public trust, divide the community, and paralyse national progress during tough times.",
      wontBe: "Oppositions just lie and sabotage good policies for their own political gain, leaving ordinary taxpayers to pay for the endless circus.",
      indifferent: "I don't know / Not sure; criticism is healthy, but constant toxic mudslinging gets on everyone's nerves."
    },

    // PODER / LEI E ORDEM
    poder_01: {
      willBe: "Law-abiding families and shopkeepers deserve safety; letting violent criminal gangs take over streets destroys the entire community.",
      cantBe: "Smash the gangs and clear out the thugs so my family can walk down our own street in peace without getting mugged or threatened.",
      mayBe: "Going in all guns blazing terrorises ordinary families, leads to dodgy cops abusing their power, and never fixes the real reasons kids turn to crime in the first place.",
      wontBe: "Whenever cops go on a rampage, innocent working blokes in an old ute get pulled over and harassed for doing nothing wrong.",
      indifferent: "I don't know / Not sure; you need to stop violent crime, but nobody wants innocent people caught in the crossfire."
    },
    poder_02: {
      willBe: "Adults should have the personal freedom to choose, and legalising it stops wasting police time so they can focus on violent crime.",
      cantBe: "I should be able to unwind with a joint or an edible after a hard week's work without fear of cops, criminal records, or losing my ticket.",
      mayBe: "Legalising drugs damages public health, worsens youth mental health, and puts massive strain on emergency departments and families.",
      wontBe: "Keep that reeking crap away from my kids, my front gate, and people driving on our local roads.",
      indifferent: "I don't know / Not sure; don't care what people do at home, but don't want it causing chaos in public."
    },
    poder_03: {
      willBe: "Targeted digital monitoring helps police intercept terrorist plots, drug syndicates, and child exploitation networks before innocent people get hurt.",
      cantBe: "If you've got nothing to hide from the cops and it catches violent crims targeting our suburbs, the state should use whatever tools it takes.",
      mayBe: "Mass government surveillance violates basic privacy rights and creates a police state where every citizen is treated as a suspect.",
      wontBe: "Government agencies can't even keep our Medicare data safe; giving them access to our private texts is an open invitation for blackmail and abuse.",
      indifferent: "I don't know / Not sure; tracking serious crims is fine, but spying on everyday citizens is a bridge too far."
    },

    // IMIGRACAO
    imigracao_01: {
      willBe: "If we don't all speak the same language and share basic Aussie values, the country just splits into separate tribes that don't talk to each other.",
      cantBe: "If you come here to live, respect our way of life and speak English like the rest of us instead of expecting us to change for you.",
      mayBe: "Forcing everyone into the same mould ruins what makes Australia great; you can be a proud Aussie and still keep your family's heritage and language.",
      wontBe: "Don't tell my family or mates to erase who we are or abandon our cultural roots just to get a fair go.",
      indifferent: "I don't know / Not sure; speaking the lingo is essential to get by, but keeping your culture is fair enough too."
    },
    imigracao_02: {
      willBe: "A multilingual society enriches our culture, connects our economy to global trade, and makes people from all backgrounds feel genuinely welcome.",
      cantBe: "Embracing diverse languages helps my community preserve our ancestral tongue and trade with partners abroad without feeling like second-class citizens.",
      mayBe: "A functioning democracy requires a single common language for laws, public debates, and workplaces; fracturing into languages undermines unity.",
      wontBe: "When signs, public services, and jobs start demanding other languages, locals who only speak English get shut out in our own country.",
      indifferent: "I don't know / Not sure; learning languages is great, but having one common language keeps everyone on the same page."
    },
    imigracao_03: {
      willBe: "Pausing immigration gives our housing, hospitals, roads, and environment a breather to catch up before quality of life degrades for everyone.",
      cantBe: "Cut immigration right now so our kids can actually afford to buy a house and local workers aren't undercut by cheap imported labour.",
      mayBe: "Australia was built on migration; closing borders starves our hospitals, farms, and aged care of vital workers and harms our standing in the world.",
      wontBe: "Closing the border stops our family members from reuniting and cuts off our businesses from hiring the skilled workers we desperately need.",
      indifferent: "I don't know / Not sure; high numbers are putting pressure on rent, but our economy still needs skilled workers."
    },

    // DIPLOMACIA
    diplomacia_01: {
      willBe: "If you want peace, prepare for defense; rogue regimes and dictators only respect military strength, not polite diplomatic speeches.",
      cantBe: "A powerful military keeps foreign aggressors from threatening our sea lanes, our resources, and our national sovereignty.",
      mayBe: "Stockpiling massive arsenals fuels an arms race, wastes billions that should go to healthcare and education, and makes war more likely.",
      wontBe: "Billions spent on shiny submarines and fighter jets is just pork-barrelling for foreign arms contractors while our local hospitals are crumbling.",
      indifferent: "I don't know / Not sure; we need defense forces, but we shouldn't be wasting money picking fights abroad."
    },
    diplomacia_02: {
      willBe: "War is a catastrophic tragedy that destroys lives and economies; every diplomatic avenue must be exhausted before a single shot is fired.",
      cantBe: "I don't want our sons and daughters coming home in body bags when conflicts could have been settled around a negotiating table.",
      mayBe: "Endless diplomatic talks just buy time for aggressive tyrants and terrorists to build up weapons and strike us when our guard is down.",
      wontBe: "Negotiating with hostile bullies who don't play by the rules is a sign of weakness that puts our country directly in their crosshairs.",
      indifferent: "I don't know / Not sure; diplomacy is always first, but you can't reason with an enemy that wants you wiped out."
    },
    diplomacia_03: {
      willBe: "Waiting to absorb a devastating first strike could wipe out our defense forces; taking out an imminent threat saves innocent lives.",
      cantBe: "Hit them before they hit us; our government's primary duty is protecting our people, not waiting around to be attacked.",
      mayBe: "Preemptive strikes violate international law, create endless cycles of retaliation, and are often based on flawed or fabricated intelligence.",
      wontBe: "Politicians love claiming an attack is 'imminent' just to drag us into illegal foreign quagmires that cost working families billions.",
      indifferent: "I don't know / Not sure; if an attack is genuinely hours away you have to act, but history shows leaders lie about threats."
    },

    // INTERVENCAO
    intervencao_01: {
      willBe: "Every nation has the sovereign right to determine its own future; foreign regime changes always create chaos, refugee crises, and devastation.",
      cantBe: "We should mind our own bloody business and fix our own backyard instead of spending our blood and treasure trying to fix other countries.",
      mayBe: "Standing by while brutal dictators butcher their own citizens or commit genocide makes the international community complicit in mass murder.",
      wontBe: "If rogue regimes with weapons of mass destruction threaten global stability and our trade routes, we can't just stick our heads in the sand.",
      indifferent: "I don't know / Not sure; foreign wars usually make things worse, but letting genocidal maniacs run riot is horrible too."
    },
    intervencao_02: {
      willBe: "When our vital economic corridors, energy supplies, or democratic partners are under direct threat, our nation must use diplomatic and economic pressure.",
      cantBe: "Our government's first and only loyalty is looking out for our own country's economic and security interests on the global stage.",
      mayBe: "Bullying and coercing smaller or poorer nations breeds global resentment and undermines the rules-based international order that protects us all.",
      wontBe: "Why should our tax dollars and export trade get hammered just because Canberra wants to play sheriff in other countries' disputes?",
      indifferent: "I don't know / Not sure; we have to defend our interests, but pushing other countries around often blows up in our face."
    },
    intervencao_03: {
      willBe: "Foreign military alliances inevitably drag us into disastrous wars on the other side of the planet that have nothing to do with our defense.",
      cantBe: "Keep our troops at home to protect our own shores, instead of blindly following big superpowers into every war they start.",
      mayBe: "Australia cannot defend its massive coastline and trade routes alone; strong security alliances deter major powers from bullying us.",
      wontBe: "If we ditch our allies, who comes to our aid when a regional superpower decides to cut off our shipping lanes or invade our waters?",
      indifferent: "I don't know / Not sure; alliances keep us safe from big bullies, but we shouldn't be dragged into dumb foreign wars."
    },

    // CONTROLE ECONOMICO
    controle_01: {
      willBe: "Key economic pillars like power generation, domestic gas, and affordable housing need national planning to ensure every citizen has heat and shelter.",
      cantBe: "State coordination of critical energy and housing resources stops price-gouging corporations from squeezing local households and businesses.",
      mayBe: "Central state planning is notoriously inefficient, suffocates private innovation, and leads to chronic shortages and bureaucratic waste.",
      wontBe: "Every time politicians try to 'plan' the economy, taxpayers get stuck with billions in botched projects and massive government debts.",
      indifferent: "I don't know / Not sure; energy and water need national planning, but leave general industry to the market."
    },
    controle_02: {
      willBe: "Market competition naturally balances supply and demand, ensuring goods are priced fairly and wages reflect productivity without bureaucratic price-fixing.",
      cantBe: "Free markets let businesses and workers negotiate their own contracts without union or government bosses telling them what they can earn.",
      mayBe: "Unregulated markets lead to corporate cartels price-gouging essentials like rent, fuel, and groceries while driving workers' wages into the ground.",
      wontBe: "Without government minimum wage laws and price watchdogs, greedy supermarket monopolies will bleed working families completely dry.",
      indifferent: "I don't know / Not sure; competitive markets work well for consumer goods, but housing and essential groceries need price oversight."
    },
    controle_03: {
      willBe: "The central bank sets interest rates that affect every mortgage and job in the nation; it must be accountable to the people we actually elected.",
      cantBe: "Elected governments should reign in central bank interest rate hikes that are crushing everyday families and small business borrowers.",
      mayBe: "An independent central bank keeps greedy politicians from printing money to bribe voters before elections, preventing hyperinflation.",
      wontBe: "If politicians control interest rates, they'll print cash like water to fund their vanity schemes and wreck the value of our savings.",
      indifferent: "I don't know / Not sure; rate hikes are painful, but giving politicians total control over the money printing press is terrifying."
    },

    // COMERCIO
    comercio_01: {
      willBe: "A country that can't manufacture its own steel, food, and medicine is dangerously vulnerable during global disruptions.",
      cantBe: "Protect local manufacturing and Aussie factories so working blokes like me don't lose our jobs to cheap sweatshop imports.",
      mayBe: "Tariffs just prop up lazy local companies and end up driving up the cost of tools, groceries, and cars for everyone.",
      wontBe: "Why should I have to pay through the nose for building supplies or a ute just to bail out some big company that can't run its own business?",
      indifferent: "I don't know / Not sure; saving jobs is good, but paying higher prices hurts everyone."
    },
    comercio_02: {
      willBe: "Slashing tariffs gives consumers access to the cheapest goods worldwide and forces our industries to become globally competitive.",
      cantBe: "Cheaper imports mean cheaper building supplies, equipment, and electronics, lowering business overheads and consumer costs.",
      mayBe: "Unilateral free trade destroys sovereign manufacturing, turns our economy into a helpless raw-materials quarry, and wipes out skilled jobs.",
      wontBe: "Free trade just hollows out our industrial heartlands, sending our kids' apprenticeship opportunities and manufacturing jobs offshore.",
      indifferent: "I don't know / Not sure; zero tariffs sounds too extreme, but sensible trade deals can bring prices down."
    },
    comercio_03: {
      willBe: "Prioritising local production keeps wages circulating within our own communities, strengthening economic resilience over cheap consumerism.",
      cantBe: "I'd rather buy Australian-made and support our local workers, even if it costs a couple of extra bucks at the counter.",
      mayBe: "Artificial import quotas trigger foreign retaliation, destroy export markets for our farmers and miners, and spark runaway consumer inflation.",
      wontBe: "With the cost of living through the roof, working families can't afford higher prices just to block foreign competition.",
      indifferent: "I don't know / Not sure; I want to buy local, but everything is already so bloody expensive."
    },

    // RELIGIAO
    religiao_01: {
      willBe: "A secular state guarantees that citizens of all faiths and no faith live as equals under the law, preventing religious conflict.",
      cantBe: "Religious dogmas shouldn't dictate what laws I have to live by, what I can read, or how I choose to conduct my personal life.",
      mayBe: "Religious teachings provide the moral foundations of Western civilisation—justice, charity, and human dignity—which secularism erodes.",
      wontBe: "Militant secularism is trying to cancel our Christian traditions, ban prayers, and marginalise believers from public life.",
      indifferent: "I don't know / Not sure; keep religion out of politics, but people should be free to practice their faith in peace."
    },
    religiao_02: {
      willBe: "Spiritual and moral teachings provide an objective compass for compassion, honesty, and family values that guide good governance.",
      cantBe: "My personal faith gives me the integrity and moral clarity to stand up for what's right against corrupt secular trends.",
      mayBe: "Imposing religious beliefs on a diverse public leads to intolerance, sectarian division, and the oppression of minority groups.",
      wontBe: "I don't want religious leaders or self-righteous moralisers telling me how to vote, who to love, or how to raise my family.",
      indifferent: "I don't know / Not sure; faith can inspire good morals in leaders, but it shouldn't be made into compulsory law."
    },
    religiao_03: {
      willBe: "Democratic laws must be grounded in universal human rights and objective facts, not the scriptures of any single faith.",
      cantBe: "Neutral laws ensure that no religious sect can use government power to discriminate against me or enforce their dietary or social rules.",
      mayBe: "No law is truly 'neutral'—secular laws just replace traditional religious morality with radical state ideologies.",
      wontBe: "Stripping religious values out of our legal system destroys the traditional protections for faith-based schools and charities.",
      indifferent: "I don't know / Not sure; laws should be fair to everyone regardless of whether they believe in God or not."
    },

    // MORAL
    moral_01: {
      willBe: "Every child deserves a loving, stable home; denying fit same-sex couples the right to adopt hurts vulnerable kids trapped in state care.",
      cantBe: "Loving gay couples have every right to build a family and adopt children without the state treating them as second-class citizens.",
      mayBe: "A child has an innate developmental need for both a mother and a father; adoption policy should prioritize the traditional family model.",
      wontBe: "Redefining adoption undermines our traditional family values and denies children their natural right to a mother and father.",
      indifferent: "I don't know / Not sure; the only thing that should matter is whether the parents provide a safe, loving home."
    },
    moral_02: {
      willBe: "Strong, stable two-parent families provide the most resilient foundation for raising healthy, emotionally secure children and sustaining society.",
      cantBe: "Upholding the traditional family model protects the generational heritage, stability, and moral standards of our community.",
      mayBe: "Insisting on a single rigid family model stigmatises single parents, foster carers, and blended families who do incredible jobs raising kids.",
      wontBe: "Real life is messy; plenty of people thrive in single-parent or non-traditional households without the government preaching to them.",
      indifferent: "I don't know / Not sure; traditional families are great, but whatever works to raise good kids is what matters."
    },
    moral_03: {
      willBe: "Treating every person with basic human dignity and respecting their declared gender identity is fundamental to a compassionate society.",
      cantBe: "People should be able to live authentically without facing discrimination, harassment, or administrative barriers in their daily lives.",
      mayBe: "Replacing biological reality with gender identity undermines women's private spaces, fair sporting competitions, and medical safeguards for youth.",
      wontBe: "Biological sex is an undeniable scientific fact; people shouldn't be forced by law or HR departments to use manufactured pronouns.",
      indifferent: "I don't know / Not sure; live and let live, but preserve fairness in women's sports and protect kids from rushed decisions."
    },

    // TECNOLOGIA
    tecnologia_01: {
      willBe: "Scientific breakthrough and industrial innovation are the true engines that cure diseases, lift living standards, and solve environmental crises.",
      cantBe: "Investing in advanced technology and modern manufacturing creates high-wage, high-skill careers for our kids and builds national wealth.",
      mayBe: "Unchecked industrial growth plunders finite natural ecosystems, generates toxic pollution, and accelerates dangerous climate disruptions.",
      wontBe: "Endless industrial expansion just turns our beautiful countryside into concrete jungles and open-cut mines for corporate profit.",
      indifferent: "I don't know / Not sure; we need technology and industry, but we can't trash our natural environment to get it."
    },
    tecnologia_02: {
      willBe: "A simpler, balanced life grounded in nature, local community, and manual crafts nurtures genuine mental health and ecological harmony.",
      cantBe: "Escaping the exhausting tech-treadmill and living self-reliantly gives my family real freedom and peace of mind.",
      mayBe: "Romanticising primitive living ignores the fact that modern technology gave us clean water, antibiotics, electricity, and long lifespans.",
      wontBe: "Going back to a primitive lifestyle is fantasy nonsense; working people depend on modern technology, tractors, and power grids to survive.",
      indifferent: "I don't know / Not sure; taking a break from screens is great, but nobody actually wants to live without modern plumbing and hospitals."
    },
    tecnologia_03: {
      willBe: "Having machines do the dangerous, backbreaking grunt work makes life safer and easier, and makes the whole country wealthier in the long run.",
      cantBe: "If you use new tech to get jobs done quicker and cheaper, you can run rings around the competition and get your weekends back.",
      mayBe: "Replacing human workers with machines guts whole towns, puts good people on the scrapheap, and hands all the cash to a few tech billionaires.",
      wontBe: "Big tech and corporate bosses are just using AI to axe our jobs and line their own pockets while leaving workers with nothing.",
      indifferent: "I don't know / Not sure; tech has always created new jobs before, but this time feels pretty bloody unpredictable."
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
