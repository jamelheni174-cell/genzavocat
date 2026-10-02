/**
 * Informations du cabinet — modifiez uniquement ce fichier pour mettre à jour
 * les coordonnées affichées partout sur le site.
 * معلومات المكتب — عدّل هذا الملف فقط لتحديث بيانات الاتصال في كامل الموقع.
 */
export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://labbaoui-avocat.tn",
  phone: "+216 71 000 000",
  mobile: "+216 98 000 000",
  whatsapp: "21698000000",
  email: "contact@labbaoui-avocat.tn",
  addressFr: "Avenue Habib Bourguiba, Immeuble Le Palmarium, 1000 Tunis, Tunisie",
  addressAr: "شارع الحبيب بورقيبة، عمارة الپالماريوم، 1000 تونس، تونس",
  mapsUrl: "https://maps.google.com/?q=Avenue+Habib+Bourguiba+Tunis",
  social: {
    facebook: "https://facebook.com/",
    linkedin: "https://linkedin.com/",
    instagram: "https://instagram.com/",
    youtube: "https://youtube.com/",
  },
  currency: "TND",
} as const;
