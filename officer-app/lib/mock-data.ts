import { CrimeType, FIRWithRelations, Officer, PoliceStation, Person, PersonInvolvement, InvolvementType } from "@/lib/types";

const stations: PoliceStation[] = [
    {
        id: "st-1",
        name: "Central Police Station",
        name_ml: "സെൻട്രൽ പോലീസ് സ്റ്റേഷൻ",
        address: "MG Road, City Center",
        district: "Thiruvananthapuram",
        phone: "0471-2345678",
        email: "sho.central@keralapolice.gov.in",
        created_at: new Date().toISOString(),
    },
    {
        id: "st-2",
        name: "Fort Police Station",
        name_ml: "ഫോർട്ട് പോലീസ് സ്റ്റേഷൻ",
        address: "Fort Area, East Fort",
        district: "Thiruvananthapuram",
        phone: "0471-2345679",
        email: "sho.fort@keralapolice.gov.in",
        created_at: new Date().toISOString(),
    },
    {
        id: "st-3",
        name: "Museum Police Station",
        name_ml: "മ്യൂസിയം പോലീസ് സ്റ്റേഷൻ",
        address: "Museum Junction",
        district: "Thiruvananthapuram",
        phone: "0471-2345680",
        email: "sho.museum@keralapolice.gov.in",
        created_at: new Date().toISOString(),
    },
    {
        id: "st-4",
        name: "Vanchiyoor Police Station",
        name_ml: "വഞ്ചിയൂർ പോലീസ് സ്റ്റേഷൻ",
        address: "Vanchiyoor, Near Court",
        district: "Thiruvananthapuram",
        phone: "0471-2345681",
        email: "sho.vanchiyoor@keralapolice.gov.in",
        created_at: new Date().toISOString(),
    },
    {
        id: "st-5",
        name: "Karamana Police Station",
        name_ml: "കരമന പോലീസ് സ്റ്റേഷൻ",
        address: "Karamana Bridge, Karamana",
        district: "Thiruvananthapuram",
        phone: "0471-2345682",
        email: "sho.karamana@keralapolice.gov.in",
        created_at: new Date().toISOString(),
    }
];

const crimeTypes: CrimeType[] = [
    {
        id: "ct-1",
        name: "Theft",
        name_ml: "മോഷണം",
        ipc_section: "378",
        description: "Dishonest taking of property",
    },
    {
        id: "ct-2",
        name: "Assault",
        name_ml: "കയ്യേറ്റം",
        ipc_section: "351",
        description: "Making a gesture or preparation causing apprehension of force",
    },
    {
        id: "ct-3",
        name: "Cheating / Fraud",
        name_ml: "വഞ്ചന",
        ipc_section: "420",
        description: "Cheating and dishonestly inducing delivery of property",
    },
    {
        id: "ct-4",
        name: "Cyber Crime",
        name_ml: "സൈബർ കുറ്റകൃത്യം",
        ipc_section: "66D IT Act",
        description: "Cheating by personation by using computer resource",
    },
    {
        id: "ct-5",
        name: "Robbery",
        name_ml: "കവർച്ച",
        ipc_section: "390",
        description: "Theft with use of force",
    },
    {
        id: "ct-6",
        name: "Trespassing",
        name_ml: "അതിക്രമ പ്രവേശം",
        ipc_section: "447",
        description: "Criminal trespass with intent to commit an offence",
    },
    {
        id: "ct-7",
        name: "Domestic Violence",
        name_ml: "ഗ്രഹ്ന പീഡനം",
        ipc_section: "498A",
        description: "Cruelty by husband or in-laws",
    }
];

const officers: Officer[] = [
    {
        id: "off-1",
        name: "Rajesh Kumar",
        rank: "Inspector",
        badge_number: "KP-1001",
        station_id: "st-1",
        phone: "9876543210",
        created_at: new Date().toISOString(),
        police_stations: stations[0],
    },
    {
        id: "off-2",
        name: "Suresh Menon",
        rank: "Sub-Inspector",
        badge_number: "KP-1002",
        station_id: "st-2",
        phone: "9876543211",
        created_at: new Date().toISOString(),
        police_stations: stations[1],
    },
    {
        id: "off-3",
        name: "Priya Nair",
        rank: "Inspector",
        badge_number: "KP-1003",
        station_id: "st-3",
        phone: "9876543212",
        created_at: new Date().toISOString(),
        police_stations: stations[2],
    },
    {
        id: "off-4",
        name: "Anilkumar Pillai",
        rank: "Sub-Inspector",
        badge_number: "KP-1004",
        station_id: "st-4",
        phone: "9876543213",
        created_at: new Date().toISOString(),
        police_stations: stations[3],
    }
];

const d = (daysAgo: number) => new Date(Date.now() - 1000 * 60 * 60 * 24 * daysAgo).toISOString();

const firs: FIRWithRelations[] = [
    // --- ACTIVE / RECENT ---
    {
        id: "fir-1", fir_number: "FIR/2025/001", date_filed: d(2), time_filed: "10:30",
        station_id: "st-1", crime_type_id: "ct-1", investigating_officer_id: "off-1",
        location: "Pazhavangadi, East Fort", location_ml: "പഴവങ്ങാടി",
        description: "Chain snatching reported near the temple. Victim is an elderly woman.",
        complainant_name: "Laxmi Nair", status: "Under Investigation",
        created_at: d(2), updated_at: d(1),
        police_stations: stations[0], crime_types: crimeTypes[0], officers: officers[0],
        case_followups: [], news_articles: []
    },
    {
        id: "fir-2", fir_number: "FIR/2025/002", date_filed: d(5), time_filed: "14:15",
        station_id: "st-2", crime_type_id: "ct-3", investigating_officer_id: "off-1",
        location: "Chalai Market", location_ml: "ചാല കമ്പോളം",
        description: "Online financial fraud. Victim transferred ₹85,000 after receiving a fake loan offer.",
        complainant_name: "Abdul Rahim", status: "Registered",
        created_at: d(5), updated_at: d(5),
        police_stations: stations[1], crime_types: crimeTypes[2], officers: officers[0],
        case_followups: [], news_articles: []
    },
    {
        id: "fir-3", fir_number: "FIR/2025/003", date_filed: d(10), time_filed: "09:00",
        station_id: "st-1", crime_type_id: "ct-2", investigating_officer_id: "off-1",
        location: "Statue Junction", location_ml: "സ്റ്റാച്യു ജംഗ്ഷൻ",
        description: "Altercation between two groups resulting in minor injuries. Three persons identified.",
        complainant_name: "Public Witness", status: "Charge Sheet Filed",
        created_at: d(10), updated_at: d(3),
        police_stations: stations[0], crime_types: crimeTypes[1], officers: officers[0],
        case_followups: [], news_articles: []
    },
    {
        id: "fir-4", fir_number: "FIR/2024/156", date_filed: d(60), time_filed: "16:45",
        station_id: "st-3", crime_type_id: "ct-1", investigating_officer_id: "off-2",
        location: "Napier Museum Premises", location_ml: "നേപ്പിയർ മ്യൂസിയം",
        description: "Bicycle theft near museum entrance. Recovered after 2 days.",
        complainant_name: "Arjun Student", status: "Closed",
        created_at: d(60), updated_at: d(10),
        police_stations: stations[2], crime_types: crimeTypes[0], officers: officers[1],
        case_followups: [], news_articles: []
    },
    {
        id: "fir-5", fir_number: "FIR/2025/004", date_filed: d(7), time_filed: "20:10",
        station_id: "st-4", crime_type_id: "ct-5", investigating_officer_id: "off-3",
        location: "Vanchiyoor Main Road", location_ml: "വഞ്ചിയൂർ",
        description: "Armed robbery at a mobile phone shop. Two suspects fled on a motorcycle.",
        complainant_name: "Shiva Prasad", status: "Under Investigation",
        created_at: d(7), updated_at: d(2),
        police_stations: stations[3], crime_types: crimeTypes[4], officers: officers[2],
        case_followups: [], news_articles: []
    },
    {
        id: "fir-6", fir_number: "FIR/2025/005", date_filed: d(14), time_filed: "11:30",
        station_id: "st-2", crime_type_id: "ct-4", investigating_officer_id: "off-1",
        location: "Technopark Phase 1", location_ml: "ടെക്നോപാർക്ക്",
        description: "Phishing attack targeting an IT employee. OTP fraud, ₹1.2 lakh stolen.",
        complainant_name: "Meera Krishnan", status: "Under Investigation",
        created_at: d(14), updated_at: d(5),
        police_stations: stations[1], crime_types: crimeTypes[3], officers: officers[0],
        case_followups: [], news_articles: []
    },
    {
        id: "fir-7", fir_number: "FIR/2025/006", date_filed: d(20), time_filed: "08:45",
        station_id: "st-5", crime_type_id: "ct-7", investigating_officer_id: "off-3",
        location: "Karamana Residential Area", location_ml: "കരമന",
        description: "Domestic violence complaint filed by wife against husband.",
        complainant_name: "Anitha Devi", status: "Registered",
        created_at: d(20), updated_at: d(20),
        police_stations: stations[4], crime_types: crimeTypes[6], officers: officers[2],
        case_followups: [], news_articles: []
    },
    {
        id: "fir-8", fir_number: "FIR/2025/007", date_filed: d(3), time_filed: "15:00",
        station_id: "st-1", crime_type_id: "ct-1", investigating_officer_id: "off-1",
        location: "Kowdiar Junction", location_ml: "കൗദ്യാർ",
        description: "Mobile phone snatched from pedestrian near ATM.",
        complainant_name: "Roshni Thomas", status: "Under Investigation",
        created_at: d(3), updated_at: d(1),
        police_stations: stations[0], crime_types: crimeTypes[0], officers: officers[0],
        case_followups: [], news_articles: []
    },
    {
        id: "fir-9", fir_number: "FIR/2025/008", date_filed: d(30), time_filed: "18:20",
        station_id: "st-3", crime_type_id: "ct-3", investigating_officer_id: "off-3",
        location: "East Fort Bus Stand", location_ml: "കിഴക്കേ കോട്ട",
        description: "Investment scam. Victim lost ₹3.5 lakhs in fake chit fund scheme.",
        complainant_name: "George Mathew", status: "Charge Sheet Filed",
        created_at: d(30), updated_at: d(7),
        police_stations: stations[2], crime_types: crimeTypes[2], officers: officers[2],
        case_followups: [], news_articles: []
    },
    {
        id: "fir-10", fir_number: "FIR/2024/200", date_filed: d(90), time_filed: "10:00",
        station_id: "st-2", crime_type_id: "ct-2", investigating_officer_id: "off-2",
        location: "Palayam Market", location_ml: "പാളയം",
        description: "Grievous hurt during a brawl at market area. Victim hospitalized.",
        complainant_name: "Sajeev Mohan", status: "Closed",
        created_at: d(90), updated_at: d(30),
        police_stations: stations[1], crime_types: crimeTypes[1], officers: officers[1],
        case_followups: [], news_articles: []
    },
    {
        id: "fir-11", fir_number: "FIR/2025/009", date_filed: d(1), time_filed: "22:30",
        station_id: "st-4", crime_type_id: "ct-2", investigating_officer_id: "off-3",
        location: "Vanchiyoor Night Club Area", location_ml: "വഞ്ചിയൂർ",
        description: "Bar fight resulting in assault. Two arrested, one at large.",
        complainant_name: "Thomas Varghese", status: "Registered",
        created_at: d(1), updated_at: d(1),
        police_stations: stations[3], crime_types: crimeTypes[1], officers: officers[2],
        case_followups: [], news_articles: []
    },
    {
        id: "fir-12", fir_number: "FIR/2025/010", date_filed: d(8), time_filed: "07:15",
        station_id: "st-5", crime_type_id: "ct-6", investigating_officer_id: "off-3",
        location: "Karamana Residential Colony", location_ml: "കരമന കോളനി",
        description: "Criminal trespass into a locked house. Suspected break-in attempt.",
        complainant_name: "Mrs. Saraswathi", status: "Under Investigation",
        created_at: d(8), updated_at: d(3),
        police_stations: stations[4], crime_types: crimeTypes[5], officers: officers[2],
        case_followups: [], news_articles: []
    },
    {
        id: "fir-13", fir_number: "FIR/2025/011", date_filed: d(45), time_filed: "13:00",
        station_id: "st-1", crime_type_id: "ct-4", investigating_officer_id: "off-1",
        location: "Pattom Junction", location_ml: "പട്ടം ജംഗ്ഷൻ",
        description: "SIM swap fraud. Victim's bank account drained after SIM cloned.",
        complainant_name: "Dr. Ramesh Pillai", status: "Charge Sheet Filed",
        created_at: d(45), updated_at: d(12),
        police_stations: stations[0], crime_types: crimeTypes[3], officers: officers[0],
        case_followups: [], news_articles: []
    },
    {
        id: "fir-14", fir_number: "FIR/2025/012", date_filed: d(6), time_filed: "12:45",
        station_id: "st-2", crime_type_id: "ct-5", investigating_officer_id: "off-1",
        location: "Overbridge, Thampanoor", location_ml: "തമ്പാനൂർ",
        description: "Purse snatching incident near railway station overbridge.",
        complainant_name: "Deepa Krishnan", status: "Under Investigation",
        created_at: d(6), updated_at: d(2),
        police_stations: stations[1], crime_types: crimeTypes[4], officers: officers[0],
        case_followups: [], news_articles: []
    },
    {
        id: "fir-15", fir_number: "FIR/2024/189", date_filed: d(75), time_filed: "09:30",
        station_id: "st-3", crime_type_id: "ct-7", investigating_officer_id: "off-2",
        location: "Museum Road", location_ml: "മ്യൂസിയം റോഡ്",
        description: "Domestic violence case. Victim escaped with children to shelter home.",
        complainant_name: "Beena Ravi", status: "Closed",
        created_at: d(75), updated_at: d(20),
        police_stations: stations[2], crime_types: crimeTypes[6], officers: officers[1],
        case_followups: [], news_articles: []
    },
    {
        id: "fir-16", fir_number: "FIR/2025/013", date_filed: d(4), time_filed: "17:00",
        station_id: "st-4", crime_type_id: "ct-3", investigating_officer_id: "off-3",
        location: "Vanchiyoor Court Premises", location_ml: "കോടതി",
        description: "Cheque bounce fraud. Accused issued fake cheques worth ₹8 lakhs.",
        complainant_name: "Muraleedharan Nair", status: "Registered",
        created_at: d(4), updated_at: d(4),
        police_stations: stations[3], crime_types: crimeTypes[2], officers: officers[2],
        case_followups: [], news_articles: []
    },
    {
        id: "fir-17", fir_number: "FIR/2025/014", date_filed: d(15), time_filed: "11:00",
        station_id: "st-5", crime_type_id: "ct-1", investigating_officer_id: "off-3",
        location: "Karamana River Bank", location_ml: "കരമന നദി",
        description: "Theft of construction equipment from a site near new bridge.",
        complainant_name: "Kerala Roads & Bridges Dev. Corp.", status: "Under Investigation",
        created_at: d(15), updated_at: d(6),
        police_stations: stations[4], crime_types: crimeTypes[0], officers: officers[2],
        case_followups: [], news_articles: []
    },
    {
        id: "fir-18", fir_number: "FIR/2024/220", date_filed: d(120), time_filed: "14:00",
        station_id: "st-1", crime_type_id: "ct-2", investigating_officer_id: "off-1",
        location: "Medical College Junction", location_ml: "മെഡിക്കൽ കോളേജ്",
        description: "Assault on a doctor by patient's relatives inside hospital premises.",
        complainant_name: "Dr. Sindhu Varma", status: "Closed",
        created_at: d(120), updated_at: d(40),
        police_stations: stations[0], crime_types: crimeTypes[1], officers: officers[0],
        case_followups: [], news_articles: []
    },
    {
        id: "fir-19", fir_number: "FIR/2025/015", date_filed: d(9), time_filed: "08:00",
        station_id: "st-2", crime_type_id: "ct-6", investigating_officer_id: "off-1",
        location: "Fort Lane Alley", location_ml: "ഫോർട്ട് ലെയ്ൻ",
        description: "Unauthorized entry into adjacent property. Dispute between neighbors.",
        complainant_name: "Krishnan Kutty", status: "Registered",
        created_at: d(9), updated_at: d(9),
        police_stations: stations[1], crime_types: crimeTypes[5], officers: officers[0],
        case_followups: [], news_articles: []
    },
    {
        id: "fir-20", fir_number: "FIR/2025/016", date_filed: d(11), time_filed: "19:30",
        station_id: "st-3", crime_type_id: "ct-4", investigating_officer_id: "off-2",
        location: "Museum Complex WIFI Zone", location_ml: "മ്യൂസിയം",
        description: "Unauthorized access to museum server. Data exfiltration attempt detected by IT team.",
        complainant_name: "Kerala Museum Authority", status: "Under Investigation",
        created_at: d(11), updated_at: d(4),
        police_stations: stations[2], crime_types: crimeTypes[3], officers: officers[1],
        case_followups: [], news_articles: []
    }
];

export const persons: Person[] = [
    { id: "p-1", name: "Ravi Kumar", age: 34, gender: "Male", address: "123 MG Road", phone: "9876543210", created_at: new Date().toISOString() },
    { id: "p-2", name: "Suresh Babu", age: 45, gender: "Male", address: "456 Park Street", phone: "9876543211", created_at: new Date().toISOString() },
    { id: "p-3", name: "Laxmi Nair", age: 29, gender: "Female", address: "Near Temple, East Fort", phone: "9876543212", created_at: new Date().toISOString() },
    { id: "p-4", name: "Jibin Joseph", age: 22, gender: "Male", address: "Vanchiyoor Colony", phone: "9876543213", created_at: new Date().toISOString() },
    { id: "p-5", name: "Pradeep Nambiar", age: 38, gender: "Male", address: "Technopark Road", phone: "9876543214", created_at: new Date().toISOString() },
];

export const personInvolvements: PersonInvolvement[] = [
    { id: "pi-1", person_id: "p-1", fir_id: "fir-1", involvement_type: InvolvementType.ACCUSED, created_at: new Date().toISOString(), details: "Identified by CCTV" },
    { id: "pi-2", person_id: "p-1", fir_id: "fir-3", involvement_type: InvolvementType.SUSPECT, created_at: new Date().toISOString(), details: "Seen at the scene" },
    { id: "pi-3", person_id: "p-3", fir_id: "fir-1", involvement_type: InvolvementType.COMPLAINANT, created_at: new Date().toISOString() },
    { id: "pi-4", person_id: "p-2", fir_id: "fir-2", involvement_type: InvolvementType.ACCUSED, created_at: new Date().toISOString(), details: "Bank account holder" },
    { id: "pi-5", person_id: "p-4", fir_id: "fir-5", involvement_type: InvolvementType.SUSPECT, created_at: new Date().toISOString(), details: "Spotted near crime scene" },
    { id: "pi-6", person_id: "p-5", fir_id: "fir-6", involvement_type: InvolvementType.ACCUSED, created_at: new Date().toISOString(), details: "Digital trail linked to phishing server" },
];

export function getPersonWithCases(personId: string) {
    const person = persons.find(p => p.id === personId);
    if (!person) return null;

    const involvements = personInvolvements.filter(pi => pi.person_id === personId);

    const involvedCases = involvements.map(pi => {
        const fir = firs.find(f => f.id === pi.fir_id);
        const firWithRelations: FIRWithRelations | undefined = fir ? {
            ...fir,
            police_stations: stations.find(s => s.id === fir.station_id)!,
            crime_types: crimeTypes.find(c => c.id === fir.crime_type_id)!,
            officers: officers.find(o => o.id === fir.investigating_officer_id)!
        } : undefined;
        return { ...pi, fir: firWithRelations };
    });

    return { ...person, involvements: involvedCases };
}

export function getCriminals() {
    const criminalInvolvements = personInvolvements.filter(pi =>
        pi.involvement_type === InvolvementType.ACCUSED ||
        pi.involvement_type === InvolvementType.SUSPECT ||
        pi.involvement_type === "Convicted" as InvolvementType
    );
    const criminalIds = Array.from(new Set(criminalInvolvements.map(pi => pi.person_id)));
    return criminalIds.map(id => getPersonWithCases(id)).filter(p => p !== null) as ReturnType<typeof getPersonWithCases>[];
}

export function searchPersons(query: string) {
    const lowerQuery = query.toLowerCase();
    return persons.filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.phone.includes(query)
    );
}

export const mockDashboardData = {
    firs,
    stations,
    crimeTypes,
    officers,
    persons,
    personInvolvements
};
