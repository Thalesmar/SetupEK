type NavCategory = {
  name: string;
  filters: string[];
  links: string[];
};

const navCategories: NavCategory[] = [
  {
    name: "Mouse",
    filters: ["Wired", "Wireless", "8K", "Ultra-light", "Under 500 MAD"],
    links: [
      "All mouse",
      "Wired mouse",
      "Ultra-light mouse",
      "Wireless mouse",
      "8K polling mouse",
      "Mouse accessories",
    ],
  },
  {
    name: "Keyboards",
    filters: ["60%", "75%", "TKL", "Wireless", "Mechanical"],
    links: [
      "All keyboards",
      "Gaming keyboards",
      "Wireless keyboards",
      "Keyboard accessories",
    ],
  },
  {
    name: "Headsets",
    filters: ["Wired", "Wireless", "USB", "Budget"],
    links: ["All headsets", "Gaming headsets", "Wireless headsets"],
  },
  {
    name: "Mousepads",
    filters: ["Large", "XL", "Speed", "Control"],
    links: ["All mousepads", "Gaming mousepads", "XL mousepads"],
  },
  {
    name: "Controllers",
    filters: ["PC", "Wireless", "PlayStation", "Xbox"],
    links: ["All controllers", "Wireless controllers", "PC controllers"],
  },
  {
    name: "Microphones",
    filters: ["USB", "XLR", "Budget", "Streaming"],
    links: ["All microphones", "USB microphones", "Streaming microphones"],
  },
  {
    name: "IEM",
    filters: ["Gaming", "Music", "Budget", "Premium"],
    links: ["All IEM", "Gaming IEM", "Music IEM"],
  },
  {
    name: "Accessories",
    filters: ["Cables", "Stands", "Grips", "Cleaning"],
    links: ["All accessories", "Mouse skates", "Keyboard switches"],
  },
];

export default navCategories;