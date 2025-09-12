// Thai Address Data Utilities
export interface Province {
  id: number;
  name_th: string;
  name_en: string;
  geography_id: number;
}

export interface Amphure {
  id: number;
  name_th: string;
  name_en: string;
  province_id: number;
}

export interface Tambon {
  id: number;
  zip_code: number;
  name_th: string;
  name_en: string;
  amphure_id: number;
}

// Cache for loaded data
let provincesCache: Province[] | null = null;
let amphuresCache: Amphure[] | null = null;
let tambonsCache: Tambon[] | null = null;

// Load provinces data
export const loadProvinces = async (): Promise<Province[]> => {
  if (provincesCache) return provincesCache;
  
  try {
    const response = await fetch('/json/thai_provinces.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    provincesCache = data;
    return data;
  } catch (error) {
    console.error('Error loading provinces:', error);
    // Return fallback data
    return [
      { id: 1, name_th: "กรุงเทพมหานคร", name_en: "Bangkok", geography_id: 2 },
      { id: 2, name_th: "เชียงใหม่", name_en: "Chiang Mai", geography_id: 1 },
      { id: 3, name_th: "เชียงราย", name_en: "Chiang Rai", geography_id: 1 }
    ];
  }
};

// Load amphures data
export const loadAmphures = async (): Promise<Amphure[]> => {
  if (amphuresCache) return amphuresCache;
  
  try {
    const response = await fetch('/json/thai_amphures.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    amphuresCache = data;
    return data;
  } catch (error) {
    console.error('Error loading amphures:', error);
    return [];
  }
};

// Load tambons data
export const loadTambons = async (): Promise<Tambon[]> => {
  if (tambonsCache) return tambonsCache;
  
  try {
    const response = await fetch('/json/thai_tambons.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    tambonsCache = data;
    return data;
  } catch (error) {
    console.error('Error loading tambons:', error);
    return [];
  }
};

// Get provinces list
export const getProvinces = async (): Promise<string[]> => {
  const provinces = await loadProvinces();
  return provinces.map(p => p.name_th).sort();
};

// Get amphures by province
export const getAmphuresByProvince = async (provinceName: string): Promise<string[]> => {
  const [provinces, amphures] = await Promise.all([loadProvinces(), loadAmphures()]);
  
  const province = provinces.find(p => p.name_th === provinceName);
  if (!province) return [];
  
  const provinceAmphures = amphures
    .filter(a => a.province_id === province.id)
    .map(a => a.name_th)
    .sort();
    
  return provinceAmphures;
};

// Get tambons by province and amphure
export const getTambonsByProvinceAndAmphure = async (
  provinceName: string, 
  amphureName: string
): Promise<string[]> => {
  const [provinces, amphures, tambons] = await Promise.all([
    loadProvinces(), 
    loadAmphures(), 
    loadTambons()
  ]);
  
  const province = provinces.find(p => p.name_th === provinceName);
  if (!province) return [];
  
  const amphure = amphures.find(a => 
    a.province_id === province.id && a.name_th === amphureName
  );
  if (!amphure) return [];
  
  const amphureTambons = tambons
    .filter(t => t.amphure_id === amphure.id)
    .map(t => t.name_th)
    .sort();
    
  return amphureTambons;
};

// Get postal code by province, amphure, and tambon
export const getPostalCode = async (
  provinceName: string,
  amphureName: string,
  tambonName: string
): Promise<string> => {
  const [provinces, amphures, tambons] = await Promise.all([
    loadProvinces(), 
    loadAmphures(), 
    loadTambons()
  ]);
  
  const province = provinces.find(p => p.name_th === provinceName);
  if (!province) return '';
  
  const amphure = amphures.find(a => 
    a.province_id === province.id && a.name_th === amphureName
  );
  if (!amphure) return '';
  
  const tambon = tambons.find(t => 
    t.amphure_id === amphure.id && t.name_th === tambonName
  );
  
  return tambon ? tambon.zip_code.toString() : '';
};
