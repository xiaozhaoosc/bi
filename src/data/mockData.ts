export interface EnvironmentData {
  temperature: number
  humidity: number
  weather: string
  date: string
  time: string
}

export interface EcoHealthData {
  biodiversityScore: number
  soilHealthScore: number
  airWaterScore: number
  ecoHealthIndex: number
}

export interface CarbonData {
  teaTreeCarbon: number
  forestCarbon: number
  carbonFactor: number
  annualCarbon: number
}

export interface BiodiversityData {
  speciesCount: number
  rareSpeciesCount: number
  weightedIndex: number
}

export interface GrowthData {
  photosynthesisEfficiency: number
  growthRhythmMatch: number
  microclimateBalance: number
  rootHealth: number
}

export interface SmartCenterData {
  aiResponseTime: number
  sensorDensity: number
  dataRichness: number
  digitalTwinAccuracy: number
  warningAdvanceTime: number
}

export interface SustainableData {
  ecoBenefit: number
  socialBenefit: number
  economicBenefit: number
  sustainableIndex: number
  communityValue: number
  waterRecycleRate: number
  carbonNeutralProgress: number
}

export const environmentData: EnvironmentData = {
  temperature: 23.5,
  humidity: 68,
  weather: '晴',
  date: '2024-04-24',
  time: '14:30:25'
}

export const ecoHealthData: EcoHealthData = {
  biodiversityScore: 85,
  soilHealthScore: 92,
  airWaterScore: 88,
  ecoHealthIndex: 88.3
}

export const carbonData: CarbonData = {
  teaTreeCarbon: 1250,
  forestCarbon: 850,
  carbonFactor: 1.2,
  annualCarbon: 2520
}

export const biodiversityData: BiodiversityData = {
  speciesCount: 156,
  rareSpeciesCount: 12,
  weightedIndex: 91
}

export const growthData: GrowthData = {
  photosynthesisEfficiency: 78,
  growthRhythmMatch: 89,
  microclimateBalance: 85,
  rootHealth: 93
}

export const smartCenterData: SmartCenterData = {
  aiResponseTime: 0.8,
  sensorDensity: 45,
  dataRichness: 8,
  digitalTwinAccuracy: 94,
  warningAdvanceTime: 72
}

export const sustainableData: SustainableData = {
  ecoBenefit: 92,
  socialBenefit: 85,
  economicBenefit: 88,
  sustainableIndex: 88.5,
  communityValue: 86,
  waterRecycleRate: 76,
  carbonNeutralProgress: 68
}

export const speciesData = [
  { name: '茶树', type: '植物', count: 12000 },
  { name: '鸟类', type: '动物', count: 35 },
  { name: '昆虫', type: '动物', count: 86 },
  { name: '微生物', type: '微生物', count: 1200 },
  { name: '草本植物', type: '植物', count: 45 },
  { name: '珍稀鸟类', type: '珍稀', count: 8 },
  { name: '珍稀昆虫', type: '珍稀', count: 4 }
]

export const monthlyCarbonData = [
  { month: '1月', value: 180 },
  { month: '2月', value: 165 },
  { month: '3月', value: 220 },
  { month: '4月', value: 250 },
  { month: '5月', value: 280 },
  { month: '6月', value: 310 },
  { month: '7月', value: 320 },
  { month: '8月', value: 305 },
  { month: '9月', value: 270 },
  { month: '10月', value: 240 },
  { month: '11月', value: 200 },
  { month: '12月', value: 180 }
]
