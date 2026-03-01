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
        name: "Cheating",
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
    }
];

const firs: FIRWithRelations[] = [
    {
        id: "fir-1",
        fir_number: "FIR/2024/001",
        date_filed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        time_filed: "10:30",
        station_id: "st-1",
        crime_type_id: "ct-1",
        investigating_officer_id: "off-1",
        location: "Pazhavangadi, East Fort",
        location_ml: "പഴവങ്ങാടി",
        description: "Chain snatching reported near the temple.",
        complainant_name: "Laxmi Nair",
        status: "Under Investigation",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
        police_stations: stations[0],
        crime_types: crimeTypes[0],
        officers: officers[0],
        case_followups: [],
        news_articles: []
    },
    {
        id: "fir-2",
        fir_number: "FIR/2024/002",
        date_filed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
        time_filed: "14:15",
        station_id: "st-2",
        crime_type_id: "ct-3",
        investigating_officer_id: "off-2",
        location: "Chalai Market",
        location_ml: "ചാല കമ്പോളം",
        description: "Online financial fraud complaint.",
        complainant_name: "Abdul Rahim",
        status: "Registered",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        police_stations: stations[1],
        crime_types: crimeTypes[2],
        officers: officers[1],
        case_followups: [],
        news_articles: []
    },
    {
        id: "fir-3",
        fir_number: "FIR/2024/003",
        date_filed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
        time_filed: "09:00",
        station_id: "st-1",
        crime_type_id: "ct-2",
        investigating_officer_id: "off-1",
        location: "Statue Junction",
        location_ml: "സ്റ്റാച്യു ജംഗ്ഷൻ",
        description: "Altercation between two groups.",
        complainant_name: "Public Witness",
        status: "Charge Sheet Filed",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        police_stations: stations[0],
        crime_types: crimeTypes[1],
        officers: officers[0],
        case_followups: [],
        news_articles: []
    },
    {
        id: "fir-4",
        fir_number: "FIR/2023/156",
        date_filed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(), // 60 days ago
        time_filed: "16:45",
        station_id: "st-3",
        crime_type_id: "ct-1",
        investigating_officer_id: "off-2", // Assigned to other officer for diversity
        location: "Napier Museum Premises",
        location_ml: "നേപ്പിയർ മ്യൂസിയം പരിസരം",
        description: "Theft of a bicycle.",
        complainant_name: "Student",
        status: "Closed",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
        police_stations: stations[2],
        crime_types: crimeTypes[0],
        officers: officers[1],
        case_followups: [],
        news_articles: []
    }
];

export const persons: Person[] = [
    {
        id: "p-1",
        name: "Ravi Kumar",
        age: 34,
        gender: "Male",
        address: "123 mg road",
        phone: "9876543210",
        created_at: new Date().toISOString()
    },
    {
        id: "p-2",
        name: "Suresh",
        age: 45,
        gender: "Male",
        address: "456 park street",
        phone: "9876543211",
        created_at: new Date().toISOString()
    },
    {
        id: "p-3",
        name: "Laxmi Nair", // Complainant in FIR-1
        age: 29,
        gender: "Female",
        address: "Near Temple, East Fort",
        phone: "9876543212",
        created_at: new Date().toISOString()
    }
];

export const personInvolvements: PersonInvolvement[] = [
    {
        id: "pi-1",
        person_id: "p-1",
        fir_id: "fir-1", // Chain Snatching
        involvement_type: InvolvementType.ACCUSED,
        created_at: new Date().toISOString(),
        details: "Identified by CCTV"
    },
    {
        id: "pi-2",
        person_id: "p-1",
        fir_id: "fir-3", // Altercation
        involvement_type: InvolvementType.SUSPECT,
        created_at: new Date().toISOString(),
        details: "Seen at the scene"
    },
    {
        id: "pi-3",
        person_id: "p-3",
        fir_id: "fir-1",
        involvement_type: InvolvementType.COMPLAINANT,
        created_at: new Date().toISOString()
    },
    {
        id: "pi-4",
        person_id: "p-2",
        fir_id: "fir-2", // Fraud
        involvement_type: InvolvementType.ACCUSED,
        created_at: new Date().toISOString(),
        details: "Bank account holder"
    }
];

// Helper to get person with all their cases
export function getPersonWithCases(personId: string) {
    const person = persons.find(p => p.id === personId);
    if (!person) return null;

    const involvements = personInvolvements.filter(pi => pi.person_id === personId);

    // Enrich involvements with FIR data
    const involvedCases = involvements.map(pi => {
        const fir = firs.find(f => f.id === pi.fir_id);

        // Enrich FIR with its relations (Station, CrimeType)
        const firWithRelations: FIRWithRelations | undefined = fir ? {
            ...fir,
            police_stations: stations.find(s => s.id === fir.station_id)!,
            crime_types: crimeTypes.find(c => c.id === fir.crime_type_id)!,
            officers: officers.find(o => o.id === fir.investigating_officer_id)!
        } : undefined;

        return {
            ...pi,
            fir: firWithRelations
        };
    });

    return {
        ...person,
        involvements: involvedCases
    };
}

// Helper to get all criminals (Accused or Suspect)
export function getCriminals() {
    // specific implementation to find unique persons who are accused or suspects
    const criminalInvolvements = personInvolvements.filter(pi =>
        pi.involvement_type === InvolvementType.ACCUSED ||
        pi.involvement_type === InvolvementType.SUSPECT ||
        pi.involvement_type === "Convicted" as InvolvementType // Future proofing
    );

    const criminalIds = Array.from(new Set(criminalInvolvements.map(pi => pi.person_id)));

    return criminalIds.map(id => getPersonWithCases(id)).filter(p => p !== null) as ReturnType<typeof getPersonWithCases>[];
}

// Add function to search persons
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
