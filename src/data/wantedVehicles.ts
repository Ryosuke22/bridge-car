export interface WantedVehicle {
  id: string;
  name: string;
  category: "Car" | "Bike" | "Car/Bike";
  tag: string;
  priority: "High" | "Normal";
}

export const highPriorityVehicles: WantedVehicle[] = [
  {
    id: "1",
    name: "Ducati 916 SP",
    category: "Bike",
    tag: "イタリアの名宝 / 希少SPモデル",
    priority: "High"
  },
  {
    id: "2",
    name: "Honda City & Motocompo",
    category: "Car/Bike",
    tag: "80's アイコン / セット買取強化",
    priority: "High"
  },
  {
    id: "3",
    name: "Nissan Figaro",
    category: "Car",
    tag: "北米・英国輸出人気 / パイクカー",
    priority: "High"
  },
  {
    id: "4",
    name: "Mitsubishi Pajero Evolution",
    category: "Car",
    tag: "ダカールラリー直系 / 輸出超高騰",
    priority: "High"
  },
  {
    id: "5",
    name: "Toyota Century",
    category: "Car",
    tag: "V12 / V8 / 海外VIP需要",
    priority: "High"
  },
  {
    id: "6",
    name: "Audi RS4 Avant",
    category: "Car",
    tag: "クワトロ / 25年ルール対象車",
    priority: "High"
  },
  {
    id: "7",
    name: "Ferrari 456 GTA",
    category: "Car",
    tag: "V12 / 2+2 / ネオクラシック",
    priority: "High"
  },
  {
    id: "8",
    name: "Ferrari 550/575 Maranello",
    category: "Car",
    tag: "V12 フロントエンジン / 伝説の名車",
    priority: "High"
  },
  {
    id: "9",
    name: "Honda Gold Monkey",
    category: "Bike",
    tag: "限定ゴールドメッキ / 未走行車高額",
    priority: "High"
  }
];

export const normalPriorityVehicles: WantedVehicle[] = [
  {
    id: "10",
    name: "Honda GB500",
    category: "Bike",
    tag: "空冷シングル / カフェレーサー",
    priority: "Normal"
  },
  {
    id: "11",
    name: "Toyota Crown Estate",
    category: "Car",
    tag: "1JZターボ搭載車 / アスリートV",
    priority: "Normal"
  },
  {
    id: "12",
    name: "Mitsubishi Legnum (MT)",
    category: "Car",
    tag: "VR-4 マニュアル車 / 希少",
    priority: "Normal"
  },
  {
    id: "13",
    name: "Subaru Legacy Touring Wagon",
    category: "Car",
    tag: "GT-B / マニュアル車求む",
    priority: "Normal"
  },
  {
    id: "14",
    name: "Daihatsu Mira Gino (Turbo)",
    category: "Car",
    tag: "ミニライトSP / ターボ車",
    priority: "Normal"
  },
  {
    id: "15",
    name: "Classic Mini Cooper",
    category: "Car",
    tag: "ローバーミニ / 最終モデル歓迎",
    priority: "Normal"
  },
  {
    id: "16",
    name: "Honda Monkey Baja",
    category: "Bike",
    tag: "絶版オフロードスタイル / コレクター向け",
    priority: "Normal"
  }
];

export const allWantedVehicles = [...highPriorityVehicles, ...normalPriorityVehicles];

// Get vehicles by category for form selection
export const getCarModels = () => {
  return allWantedVehicles
    .filter(v => v.category === "Car" || v.category === "Car/Bike")
    .map(v => v.name);
};

export const getBikeModels = () => {
  return allWantedVehicles
    .filter(v => v.category === "Bike" || v.category === "Car/Bike")
    .map(v => v.name);
};
