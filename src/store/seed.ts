import { addDays, format } from 'date-fns'
import type { AppState, Friend } from '../types'
import { avatarFor, bannerFor } from '../utils/avatar'

const today = new Date()
const d = (offset: number) => format(addDays(today, offset), 'yyyy-MM-dd')

export const ME_ID = 'me'

export const seedDiscoverableUsers: Friend[] = [
  { id: 'u1', pseudo: 'MaxSpeed_92', photoUrl: avatarFor('MaxSpeed_92') },
  { id: 'u2', pseudo: 'Nora_Harley', photoUrl: avatarFor('Nora_Harley') },
  { id: 'u3', pseudo: 'ThomasEvo9', photoUrl: avatarFor('ThomasEvo9') },
  { id: 'u4', pseudo: 'Camille_CBR', photoUrl: avatarFor('Camille_CBR') },
  { id: 'u5', pseudo: 'AdamRS3', photoUrl: avatarFor('AdamRS3') },
]

export const seedState: AppState = {
  profile: {
    pseudo: 'RidaTheBoss',
    age: 24,
    photoUrl: avatarFor('RidaTheBoss'),
    bannerUrl: bannerFor('RidaTheBoss-banner'),
    description: "Passionné de sorties moto et voiture. Toujours partant pour un bon Rasso le week-end !",
    carPhotoUrl: '',
    motoPhotoUrl: '',
  },
  friends: [
    { id: 'f1', pseudo: 'Karim_GTI', photoUrl: avatarFor('Karim_GTI') },
    { id: 'f2', pseudo: 'SofiaR6', photoUrl: avatarFor('SofiaR6') },
    { id: 'f3', pseudo: 'Yanis_M3', photoUrl: avatarFor('Yanis_M3') },
    { id: 'f4', pseudo: 'LucieDucati', photoUrl: avatarFor('LucieDucati') },
  ],
  events: [
    {
      id: 'e1',
      title: 'Rasso Tuning Nocturne',
      type: 'voiture',
      address: 'Parking Carrefour, Aix-en-Provence',
      date: d(2),
      time: '20:30',
      endTime: '23:30',
      rules: "Pas de rodéo, respect du voisinage, casque obligatoire pour les passagers.",
      conditions: 'Places limitées à 40 véhicules. Inscription sur place.',
      creatorId: 'f1',
      creatorName: 'Karim_GTI',
      creatorPhoto: avatarFor('Karim_GTI'),
    },
    {
      id: 'e2',
      title: 'Sortie Moto Matinale',
      type: 'moto',
      address: 'Col de la Faucille, Gex',
      date: d(4),
      time: '08:00',
      endTime: '12:00',
      rules: 'Equipement complet obligatoire (casque, gants, blouson). Allure de groupe respectée.',
      conditions: "Niveau intermédiaire minimum. RDV 15 min avant au parking.",
      creatorId: 'f2',
      creatorName: 'SofiaR6',
      creatorPhoto: avatarFor('SofiaR6'),
    },
    {
      id: 'e3',
      title: 'Rasso Mixte Auto/Moto',
      type: 'mixte',
      address: 'Zone industrielle, Vitrolles',
      date: d(6),
      time: '18:00',
      endTime: '22:00',
      rules: 'Ambiance familiale, aucune insulte tolérée, respect des riverains.',
      conditions: 'Gratuit, ouvert à tous les véhicules.',
      creatorId: 'me',
      creatorName: 'RidaTheBoss',
      creatorPhoto: avatarFor('RidaTheBoss'),
    },
  ],
  locations: [
    { id: 'l1', name: 'Parking Carrefour', address: 'Aix-en-Provence', type: 'voiture' },
    { id: 'l2', name: 'Col de la Faucille', address: 'Gex', type: 'moto' },
    { id: 'l3', name: 'Zone industrielle', address: 'Vitrolles', type: 'mixte' },
    { id: 'l4', name: 'Esplanade du Port', address: 'Marseille', type: 'mixte' },
    { id: 'l5', name: 'Circuit Paul Ricard - Parking', address: 'Le Castellet', type: 'voiture' },
  ],
  presence: [d(2), d(4)],
  messages: [
    { id: 'm1', friendId: 'f1', from: 'them', text: 'Salut ! Tu viens au Rasso de vendredi ?', time: '10:12' },
    { id: 'm2', friendId: 'f1', from: 'me', text: "Ouais carrément, j'amène la GTI 👍", time: '10:15' },
    { id: 'm3', friendId: 'f2', from: 'them', text: "N'oublie pas ton équipement pour dimanche !", time: '09:00' },
  ],
  notifications: [],
}
