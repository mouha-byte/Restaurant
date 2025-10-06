// Grouped pizza data for better organization and size selection
const pizzaProducts = [
  {
    name: "Margherita Pizza",
    baseDescription: "Symbole de la tradition italienne : une base tomate parfumée et une mozzarella fondante pour une pureté de goût.",
    category: "pizza",
    image: "images/1.jpg",
    ingredients: ["Base Tomate", "Mozzarella"],
    sizes: [
      { size: "Junior", price: 8, description: "Format individuel, idéal pour une personne." },
      { size: "Senior", price: 12.5, description: "Format moyen, parfait pour une personne affamée ou à partager." },
      { size: "Méga", price: 15.5, description: "Grand format pour 2-3 personnes, idéal à partager." }
    ]
  },
  {
    name: "Bambino Pizza",
    baseDescription: "Recette douce et équilibrée pensée pour les plus jeunes gourmands.",
    category: "pizza",
    image: "images/2.jpg",
    ingredients: ["Base Tomate", "Mozzarella", "Jambon", "Œuf"],
    sizes: [
      { size: "Junior", price: 8.5, description: "Format individuel, idéal pour une personne." },
      { size: "Senior", price: 14.5, description: "Format moyen, parfait pour une personne affamée ou à partager." },
      { size: "Méga", price: 18.5, description: "Grand format pour 2-3 personnes, idéal à partager." }
    ]
  },
  {
    name: "Calzone Pizza",
    baseDescription: "Version fermée gourmande au cœur fondant et généreux.",
    category: "pizza",
    image: "images/3.jpg",
    ingredients: ["Base Tomate", "Mozzarella", "Viande Hachée ou Jambon", "Œuf"],
    sizes: [
      { size: "Junior", price: 8.5, description: "Format individuel, idéal pour une personne." },
      { size: "Senior", price: 14.5, description: "Format moyen, parfait pour une personne affamée ou à partager." },
      { size: "Méga", price: 18.5, description: "Grand format pour 2-3 personnes, idéal à partager." }
    ]
  },
  {
    name: "Napolitaine Pizza",
    baseDescription: "Spécialité méditerranéenne aux notes marines authentiques et intenses.",
    category: "pizza",
    image: "images/5.jpg",
    ingredients: ["Base Tomate", "Mozzarella", "Anchois", "Câpres", "Olives"],
    sizes: [
      { size: "Junior", price: 8.5, description: "Format individuel, idéal pour une personne." },
      { size: "Senior", price: 14.5, description: "Format moyen, parfait pour une personne affamée ou à partager." },
      { size: "Méga", price: 18.5, description: "Grand format pour 2-3 personnes, idéal à partager." }
    ]
  },
  {
    name: "Regina Pizza",
    baseDescription: "Classique savoureuse mêlant jambon délicat et champignons fondants.",
    category: "pizza",
    image: "images/pizza napolitaine.jpg",
    ingredients: ["Base Tomate", "Mozzarella", "Jambon", "Champignons"],
    sizes: [
      { size: "Junior", price: 8.5, description: "Format individuel, idéal pour une personne." },
      { size: "Senior", price: 14.5, description: "Format moyen, parfait pour une personne affamée ou à partager." },
      { size: "Méga", price: 18.5, description: "Grand format pour 2-3 personnes, idéal à partager." }
    ]
  },
  {
    name: "4 Fromages Pizza",
    baseDescription: "Alliance onctueuse et parfumée des meilleurs fromages.",
    category: "pizza",
    image: "images/6.jpg",
    ingredients: ["Base Tomate", "Mozzarella", "Gorgonzola", "Chèvre", "Brie"],
    sizes: [
      { size: "Junior", price: 8.5, description: "Format individuel, idéal pour une personne." },
      { size: "Senior", price: 14.5, description: "Format moyen, parfait pour une personne affamée ou à partager." },
      { size: "Méga", price: 18.5, description: "Grand format pour 2-3 personnes, idéal à partager." }
    ]
  },
  {
    name: "Campion Pizza",
    baseDescription: "Recette robuste et gourmande pour les appétits solides.",
    category: "pizza",
    image: "images/campion pizza.jpg",
    ingredients: ["Base Tomate", "Mozzarella", "Viande Hachée", "Champignons"],
    sizes: [
      { size: "Junior", price: 8.5, description: "Format individuel, idéal pour une personne." },
      { size: "Senior", price: 14.5, description: "Format moyen, parfait pour une personne affamée ou à partager." },
      { size: "Méga", price: 18.5, description: "Grand format pour 2-3 personnes, idéal à partager." }
    ]
  },
  {
    name: "4 Saisons Pizza",
    baseDescription: "Un tour des saveurs : chaque part révèle une nuance différente.",
    category: "pizza",
    image: "images/8.jpg",
    ingredients: ["Base Tomate", "Mozzarella", "Jambon", "Champignons", "Poivrons", "Olives"],
    sizes: [
      { size: "Junior", price: 9, description: "Format individuel, idéal pour une personne." },
      { size: "Senior", price: 15, description: "Format moyen, parfait pour une personne affamée ou à partager." },
      { size: "Méga", price: 19, description: "Grand format pour 2-3 personnes, idéal à partager." }
    ]
  },
  {
    name: "Vegetarienne Pizza",
    baseDescription: "Saveurs fraîches du jardin : mélange coloré de légumes méditerranéens sur une base tomate légère.",
    category: "pizza",
    image: "images/9.jpg",
    ingredients: ["Base Tomate", "Mozzarella", "Aubergines", "Champignons", "Poivrons", "Oignons", "Olives", "Tomate"],
    sizes: [
      { size: "Junior", price: 9, description: "Format individuel, idéal pour une personne." },
      { size: "Senior", price: 15, description: "Format moyen, parfait pour une personne affamée ou à partager." },
      { size: "Méga", price: 19, description: "Grand format pour 2-3 personnes, idéal à partager." }
    ]
  },
  {
    name: "Orientale Pizza",
    baseDescription: "Saveurs épicées d'Orient : merguez parfumée, poivrons colorés et œuf pour une touche gourmande.",
    category: "pizza",
    image: "images/10.jpg",
    ingredients: ["Base Tomate", "Mozzarella", "Merguez", "Poivrons", "Oignons", "Œuf"],
    sizes: [
      { size: "Junior", price: 9, description: "Format individuel, idéal pour une personne." },
      { size: "Senior", price: 15, description: "Format moyen, parfait pour une personne affamée ou à partager." },
      { size: "Méga", price: 19, description: "Grand format pour 2-3 personnes, idéal à partager." }
    ]
  },
  {
    name: "Speranza Pizza",
    baseDescription: "Création signature riche en viandes et en caractère.",
    category: "pizza",
    image: "images/speranza pizza.jpg",
    ingredients: ["Base Tomate", "Mozzarella", "Viande Hachée", "Merguez", "Poulet", "Buffalo"],
    sizes: [
      { size: "Junior", price: 9, description: "Format individuel, idéal pour une personne." },
      { size: "Senior", price: 15, description: "Format moyen, parfait pour une personne affamée ou à partager." },
      { size: "Méga", price: 19, description: "Grand format pour 2-3 personnes, idéal à partager." }
    ]
  },
  {
    name: "Mexicaine Pizza",
    baseDescription: "Alliance relevée et généreuse aux inspirations latines.",
    category: "pizza",
    image: "images/mexicaine pizza.jpg",
    ingredients: ["Base Tomate", "Mozzarella", "Viande Hachée", "Merguez", "Oignons", "Tomates"],
    sizes: [
      { size: "Junior", price: 9, description: "Format individuel, idéal pour une personne." },
      { size: "Senior", price: 15, description: "Format moyen, parfait pour une personne affamée ou à partager." },
      { size: "Méga", price: 19, description: "Grand format pour 2-3 personnes, idéal à partager." }
    ]
  },
  // Add all other pizzas here using the same structure...
];