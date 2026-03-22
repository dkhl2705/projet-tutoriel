export const CHILDREN = [
  {
    id: 1, firstName: 'Sophie', lastName: 'Dupont', avatar: null,
    age: '3 ans', birthdate: '15 mars 2023', bloodType: 'A+',
    allergies: 'Arachides', gender: 'Fille',
    progress: 50,
    nextVaccine: { name: 'ROR 2ème dose', date: '25 Jan 2026', daysLeft: 3, urgent: true },
    vaccines: [
      { name: 'BCG',         date: '15 Mar 2023', status: 'done',     doctor: 'Dr. Kamga',  hospital: 'Hôpital Central', note: 'Bien toléré' },
      { name: 'DTP 1',       date: '15 Mai 2023', status: 'done',     doctor: 'Dr. Kamga',  hospital: 'Hôpital Central', note: '' },
      { name: 'Hépatite B',  date: '20 Jul 2023', status: 'done',     doctor: 'Dr. Mballa', hospital: 'Clinique Jouvence', note: '' },
      { name: 'Pneumocoque', date: '05 Sep 2023', status: 'done',     doctor: 'Dr. Kamga',  hospital: 'Hôpital Central', note: 'Légère rougeur' },
      { name: 'ROR 1',       date: '10 Avr 2024', status: 'done',     doctor: 'Dr. Kamga',  hospital: 'Hôpital Central', note: '' },
      { name: 'ROR 2',       date: '25 Jan 2026', status: 'upcoming', doctor: 'Dr. Kamga',  hospital: 'Hôpital Central', note: '' },
      { name: 'Varicelle',   date: '25 Mar 2026', status: 'upcoming', doctor: 'Dr. Kamga',  hospital: 'Hôpital Central', note: '' },
      { name: 'DTP rappel',  date: '15 Mai 2026', status: 'upcoming', doctor: 'Dr. Kamga',  hospital: 'Hôpital Central', note: '' },
    ],
  },
  {
    id: 2, firstName: 'Kofi', lastName: 'Dupont', avatar: null,
    age: '6 mois', birthdate: '15 Sep 2025', bloodType: 'O+',
    allergies: 'Aucune', gender: 'Garçon',
    progress: 40,
    nextVaccine: { name: 'DTP 2', date: 'Dans 3 jours', daysLeft: 3, urgent: false },
    vaccines: [
      { name: 'BCG',         date: '15 Sep 2025', status: 'done',     doctor: 'Dr. Kamga', hospital: 'Hôpital Central', note: '' },
      { name: 'DTP 1',       date: '15 Nov 2025', status: 'done',     doctor: 'Dr. Kamga', hospital: 'Hôpital Central', note: '' },
      { name: 'DTP 2',       date: '25 Jan 2026', status: 'upcoming', doctor: 'Dr. Kamga', hospital: 'Hôpital Central', note: '' },
      { name: 'Pneumocoque', date: '10 Mar 2026', status: 'upcoming', doctor: 'Dr. Kamga', hospital: 'Hôpital Central', note: '' },
      { name: 'Hépatite B',  date: '15 Apr 2026', status: 'upcoming', doctor: 'Dr. Kamga', hospital: 'Hôpital Central', note: '' },
    ],
  },
];

export const DOCTOR_PATIENTS = [
  { id:1, name:'Sophie Dupont', age:'3 ans',    vaccine:'ROR 2',      date:'Demain',       daysLeft:1,  parent:'Marie Dupont',   phone:'+237 671 234 567', notified:true },
  { id:2, name:'Kofi Adjei',    age:'6 mois',   vaccine:'DTP 2',      date:'Dans 3 jours', daysLeft:3,  parent:'Kwame Adjei',    phone:'+237 680 345 678', notified:true },
  { id:3, name:'Fatou Diallo',  age:'Nouveau-né',vaccine:'BCG',        date:'Dans 6 jours', daysLeft:6,  parent:'Mariama Diallo', phone:'+237 692 456 789', notified:false },
  { id:4, name:'Samuel Biya',   age:'2 ans',    vaccine:'Varicelle',  date:'Dans 10 jours',daysLeft:10, parent:'Paul Biya Jr',   phone:'+237 655 112 233', notified:false },
];

export const HOSPITALS = [
  { name:'Hôpital Central de Yaoundé', distance:'0.8 km', open:true,  rating:4.5, address:'Avenue Kennedy, Yaoundé',    vaccines:['ROR','DTP','BCG','Pneumocoque'] },
  { name:'Clinique Jouvence',          distance:'1.2 km', open:true,  rating:4.2, address:'Rue de la Joie, Yaoundé',    vaccines:['DTP','Pneumocoque','Hépatite B'] },
  { name:'Centre de Santé Bastos',     distance:'2.1 km', open:false, rating:3.9, address:'Quartier Bastos, Yaoundé',   vaccines:['BCG','Hépatite B'] },
  { name:'Hôpital de District',        distance:'3.4 km', open:true,  rating:4.0, address:'Boulevard du 20 Mai, Yaoundé',vaccines:['Varicelle','ROR','DTP'] },
];

export const AI_RESPONSES = {
  'fièvre':    "Une légère fièvre (37,5–38,5°C) après un vaccin est normale et peut durer 1 à 2 jours. Elle indique que le système immunitaire réagit bien. Donnez du paracétamol adapté à l'âge de l'enfant. Si elle dépasse 39°C ou dure plus de 3 jours, consultez votre médecin.",
  'ror':       "Le vaccin ROR protège contre la Rougeole, les Oreillons et la Rubéole. Il est recommandé en 2 doses : 12 mois et 16–18 mois. Effets courants : légère rougeur, parfois une petite éruption 7–12 jours après.",
  'dtp':       "Le DTP protège contre Diphtérie, Tétanos et Poliomyélite. Il est administré à 2, 4 et 6 mois, puis des rappels à 18 mois et 6 ans.",
  'bcg':       "Le BCG protège contre la tuberculose. Il est administré à la naissance ou dans le premier mois. Une petite cicatrice au site d'injection est normale.",
  'effet':     "Effets secondaires courants : légère rougeur/douleur, petite fièvre, irritabilité pendant 24–48h. Ces signes sont bénins et passagers. Les réactions allergiques graves sont très rares.",
  'rappel':    "Vos rappels sont envoyés automatiquement 24h avant chaque vaccin via notification push, même si l'application est fermée. Gérez vos préférences dans Profil → Notifications.",
  'allergi':   "Les allergies doivent être signalées à votre médecin avant toute vaccination. Certains vaccins peuvent contenir des traces de substances allergènes (œuf, gélatine). Consultez toujours un professionnel de santé.",
  'calendri':  "Le calendrier vaccinal OMS pour nourrissons inclut : BCG (naissance), Hépatite B (naissance), DTP (2,4,6 mois), Pneumocoque (2,4,12 mois), ROR (12 et 18 mois). Consultez votre médecin pour un calendrier personnalisé.",
  'default':   "Je suis votre assistant vaccinal IA VacciSmart. Je peux répondre à vos questions sur les vaccins, effets secondaires, calendrier et rappels. N'hésitez pas à préciser votre question !",
};
