const participants = [
  ['Gabriel Navarro', '09373456780', 'Suzuki Jimny 5-Door', 'JIM 2027', 'Exhibitor'],
  ['Samantha Ortega', '09362345670', 'Mitsubishi Pajero', 'PJR 1999', 'Exhibitor'],
  ['Marco Santiago', '09171234567', 'Toyota AE86 Trueno', 'AE86 1986', 'Exhibitor'],
  ['Elaine Reyes', '09451234567', 'Honda Civic Type R', 'CTR 2021', 'Exhibitor'],
  ['Daniel Cruz', '09081234567', 'Ford Mustang GT', 'MUS 2022', 'Exhibitor'],
  ['Arabela Garcia', '09181234001', 'Mazda MX-5 Miata', 'MX5 2024', 'Exhibitor'],
  ['Miguel Santos', '09281234002', 'Nissan Skyline GT-R', 'GTR 1998', 'Exhibitor'],
  ['Andrea Mendoza', '09381234003', 'Subaru WRX STI', 'WRX 2020', 'Exhibitor'],
  ['Paolo Villanueva', '09481234004', 'Toyota Supra MK4', 'SUP 1994', 'Competitor'],
  ['Camille Flores', '09581234005', 'Porsche 911 Carrera', 'POR 2023', 'Competitor'],
  ['Joshua Ramos', '09681234006', 'Honda Civic EG', 'CIV 1995', 'Competitor'],
  ['Bea Castillo', '09781234007', 'Mitsubishi Lancer Evo IX', 'EVO 2006', 'Competitor'],
  ['Enzo Bautista', '09881234008', 'BMW M3 Competition', 'BMW 2022', 'Competitor'],
  ['Sofia Aquino', '09981234009', 'Volkswagen Golf GTI', 'GTI 2021', 'Competitor'],
  ['Luis Fernandez', '09191234010', 'Chevrolet Camaro SS', 'CAM 2019', 'Competitor'],
  ['Patricia Lim', '09291234011', 'Hyundai Ioniq 5 N', 'ION 2025', 'Competitor'],
  ['Noah Dizon', '09391234012', 'Mazda RX-7 FD', 'RX7 1993', 'Competitor'],
  ['Isabel Torres', '09491234013', 'Toyota GR86', 'GR8 2024', 'Competitor'],
  ['Rafael Perez', '09591234014', 'Nissan 350Z', '350 2005', 'VIP'],
  ['Mia Valdez', '09691234015', 'Mercedes-Benz C63 AMG', 'AMG 2021', 'VIP'],
  ['Adrian Gomez', '09791234016', 'Honda S2000', 'S2K 2004', 'VIP'],
  ['Chloe Dominguez', '09891234017', 'Toyota Land Cruiser', 'LC 2023', 'VIP'],
  ['Gabriel Tan', '09991234018', 'Audi RS5 Sportback', 'AUD 2022', 'VIP'],
  ['Nicole Mercado', '09161234019', 'Suzuki Swift Sport', 'SWS 2020', 'VIP'],
  ['Joaquin Rivera', '09261234020', 'Dodge Challenger', 'DOD 2018', 'VIP'],
]

const statuses = [
  ...Array(10).fill('Confirmed'),
  ...Array(6).fill('CheckedIn'),
  ...Array(6).fill('Pending'),
  ...Array(3).fill('Cancelled'),
]

const paidAmounts = [
  ...participants.slice(0, 16).map((person, index) => person[4] === 'Exhibitor' && index === 0 ? 1500 : person[4] === 'Exhibitor' ? 2000 : 2500),
  2000, 2000, 1500, 1000, 0, 0, 0, 0, 0,
]

export const registrations = participants.map((person, index) => {
  const [participantName, contactNumber, carMakeModel, plateNumber, registrationType] = person
  const registrationFee = registrationType === 'Exhibitor' ? (index === 0 ? 1500 : 2000) : registrationType === 'Competitor' ? 2500 : 3000
  const amountPaid = paidAmounts[index]

  return {
    id: `registration-${String(index + 1).padStart(3, '0')}`,
    registrationNumber: `CS27-${String(index + 13).padStart(4, '0')}`,
    registrationDate: new Date(Date.UTC(2027, 1, 13 + Math.floor(index / 2), 0, 25 + (index % 2) * 40)).toISOString(),
    participantName,
    contactNumber,
    email: `${participantName.toLowerCase().replaceAll(' ', '.')}@example.com`,
    address: `${100 + index} Rizal Street, Sorsogon City`,
    carMakeModel,
    plateNumber,
    registrationType,
    status: statuses[index],
    registrationFee,
    amountPaid,
    paymentStatus: amountPaid === 0 ? 'Unpaid' : amountPaid < registrationFee ? 'Partial' : 'Paid',
  }
})

export async function getRegistrations({ participantName = '', type = 'All', status = 'All', page = 1, pageSize = 10 } = {}) {
  const normalizedName = participantName.trim().toLocaleLowerCase()
  const filtered = registrations.filter((registration) => {
    const matchesName = !normalizedName || registration.participantName.toLocaleLowerCase().includes(normalizedName)
    const matchesType = type === 'All' || registration.registrationType === type
    const matchesStatus = status === 'All' || registration.status === status
    return matchesName && matchesType && matchesStatus
  })
  const totalCount = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const currentPage = Math.min(Math.max(1, page), totalPages)

  return {
    items: filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    page: currentPage,
    pageSize,
    totalCount,
    totalPages,
  }
}

export async function getSummary() {
  const summary = registrations.reduce((totals, registration) => {
    totals.totalRegistrations += 1
    if (registration.status === 'CheckedIn') totals.checkedIn += 1
    else totals[registration.status.toLowerCase()] += 1
    totals.totalFees += registration.registrationFee
    totals.totalPayments += registration.amountPaid
    return totals
  }, { totalRegistrations: 0, confirmed: 0, checkedIn: 0, pending: 0, cancelled: 0, totalFees: 0, totalPayments: 0, uncollectedPayments: 0 })

  summary.uncollectedPayments = summary.totalFees - summary.totalPayments
  return summary
}
