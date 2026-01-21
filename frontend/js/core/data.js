window.Kiosk = window.Kiosk || {};

Kiosk.data = {
  categories: [
    { id: "drink", name: "Drink", icon: "./assets/category/drink.png" },
    { id: "food",  name: "Food",  icon: "./assets/category/food.png" },
    { id: "rtd",   name: "Ready-To-Drink", icon: "./assets/category/soft-drink.png" }
  ],

  subCategories: {
    drink: [
      { id: "tea", name: "Tea" ,icon: "./assets/sub-category/tea.png" },
      { id: "coffee", name: "Coffee" ,icon: "./assets/sub-category/coffee.png" },
      { id: "signature", name: "Signature" ,icon: "./assets/sub-category/signature.png" }
    ],
    food: [
      { id: "toaster", name: "Toaster" },
      { id : "set", name: "Set"}// only 1 => bar hidden by rule
    ],
    rtd: []
  },

  products: [
    { id: 101, categoryId: "drink", subCategoryId: "tea", name: "Teh", price: 1.25, image: "./assets/tea/Teh.png" },
    { id: 102, categoryId: "drink", subCategoryId: "tea", name: "Teh C", price: 1.25, image: "./assets/tea/Teh C.png" },
    { id: 103, categoryId: "drink", subCategoryId: "signature", name: "Signature Drink", price: 2.00, image: "./assets/signature/Milo Dinosaur.png" },
    { id: 104, categoryId: "drink", subCategoryId: "coffee", name: "Coffee", price: 1.50, image: "./assets/coffee/Kopi.png" },

    { id: 201, categoryId: "food", subCategoryId: "toaster", name: "Toast", price: 1.20, image: "./assets/toast/Kaya Butter Toast.png" },

    { id: 301, categoryId: "rtd", subCategoryId: null, name: "Bottle Drink", price: 1.10, image: "./assets/Ready-To-Drink/soda.png" }
  ],

  // default variant options (can later be per product)
  variantGroups: [
    {
      key: "type",
      title: "Type",
      required: true,
      options: [
        { id: "hot", label: "Hot", delta: 0 },
        { id: "cold", label: "Cold", delta: 0.50 }
      ]
    },
    {
      key: "sugar",
      title: "Sugar Level",
      required: true,
      options: [
        { id: "0", label: "0%", delta: 0 },
        { id: "50", label: "50%", delta: 0 },
        { id: "100", label: "100%", delta: 0 }
      ]
    },
    {
      key: "size",
      title: "Size",
      required: true,
      options: [
        { id: "S", label: "S", delta: 0 },
        { id: "M", label: "M", delta: 1.00 },
        { id: "L", label: "L", delta: 1.25 }
      ]
    }
  ]
};
