export type VehicleType = 'voiture' | 'moto' | 'mixte'

export interface Profile {
  pseudo: string
  age: number
  photoUrl: string
  bannerUrl: string
  description: string
  carPhotoUrl: string
  motoPhotoUrl: string
}

export interface Friend {
  id: string
  pseudo: string
  photoUrl: string
}

export interface RassoEvent {
  id: string
  title: string
  type: VehicleType
  address: string
  date: string // ISO yyyy-MM-dd
  time: string // HH:mm
  rules: string
  conditions: string
  creatorId: string
  creatorName: string
  creatorPhoto: string
}

export interface Location {
  id: string
  name: string
  address: string
  type: VehicleType
}

export interface ChatMessage {
  id: string
  friendId: string
  from: 'me' | 'them'
  text: string
  time: string
}

export interface AppNotification {
  id: string
  actorId: string
  actorName: string
  actorPhoto: string
  type: 'follow'
  read: boolean
  createdAt: string
}

export interface AppState {
  profile: Profile
  friends: Friend[]
  events: RassoEvent[]
  locations: Location[]
  presence: string[] // ISO dates where user marked "présent"
  messages: ChatMessage[]
  notifications: AppNotification[]
}
