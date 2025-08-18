import {
	HiOutlineViewGrid,
	HiOutlineCube,
	HiOutlineShoppingCart,
	HiOutlineUsers,
	HiOutlineDocumentText,
	HiOutlineAnnotation,
	HiOutlineQuestionMarkCircle,
	HiOutlineCog		
} from 'react-icons/hi'
import { 
	AiFillAccountBook,
	AiFillAppstore,
	AiFillEdit,
	AiFillFolderOpen


} from "react-icons/ai";
import {
	 FiUserPlus ,
	 FiUsers



	} from "react-icons/fi";
export const DASHBOARD_SIDEBAR_LINKS = [
	{
		key: 'dashboard',
		label: 'Dashboard',
		path: '/Dashboard',
		icon: <HiOutlineViewGrid />,
		roles: ['admin', 'salesrep', 'manager'] // Accessible to all roles
	},

	{
		key: 'orders',
		label: 'Project Management',
		path: '/product',
		icon: <HiOutlineShoppingCart />,
		roles: ['admin', 'salesrep'], // Accessible to all roles
		subMenu: [
			
			{ key: 'sub1', label: 'Add New Project', path: '/addproject', icon: < AiFillAccountBook/> },
			{ key: 'sub2', label: 'View Project', path: '', icon: < AiFillAccountBook/> },
			
			
			
		],

	},
	{
		key: 'Customer Management',
		label: 'Customer Management',
		path: '/products',
		icon: <HiOutlineCube />,
		roles: ['admin', 'salesrep', 'customer'],
		subMenu: [
			{ key: 'sub2', label: 'Add Customer', path: '', icon: <AiFillFolderOpen /> },
			{ key: 'sub2', label: 'Add Supplier', path: '', icon: <AiFillFolderOpen /> },
			
			
		  ],
	},

	
	{
		key: 'Roots',
		label: 'Service Center Management',
		path: '/customers',
		icon: <HiOutlineUsers />,
		roles: ['admin', 'sales', 'customer'],
		subMenu: [
			
			{ key: 'sub2', label: 'Add Vehicles', path: '', icon: <AiFillAppstore /> },
			
			
		  ],
	},
	{
		key: 'User Management',
		label: 'User Management',
		path: '/users',
		icon: <HiOutlineUsers />,
		roles: ['admin'],
		subMenu: [
			
			{ key: 'sub21', label: 'Add new user', path: '', icon: < FiUserPlus /> },
			
			
		  ],
	},
	{
		key: 'transactions',
		label: 'Transactions',
		path: '/transactions',
		icon: <HiOutlineDocumentText />,
		roles:['admin', 'salesrep', 'customer'],
		subMenu: [
			
			{ key: 'sub5', label: 'Add Product Main stock', path: '', icon: <AiFillAppstore /> },
			{ key: 'sub5', label: 'Add Invoice', path: '', icon: <AiFillAppstore /> },
			
			
			
			
		  ],
	},
	{
		key: 'messages',
		label: 'Report',
		path: '/PremadeProductPage',
		icon: <HiOutlineAnnotation />,
		roles: ['admin', 'salesrep'],
		subMenu: [
			{ key: 'sub7', label: 'Product List ', path: '', icon: <AiFillAppstore /> },
			{ key: 'sub7', label: 'Receipt List ', path: '', icon: <AiFillAppstore /> },
			{ key: 'sub2', label: 'Customer List', path: '', icon: <AiFillFolderOpen /> },	
			

			{ key: 'sub2', label: 'Company Sales Report', path: '', icon: <AiFillFolderOpen /> },
		  ],
	}
]

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
	{
		key: 'settings',
		label: 'Settings',
		path: '/settings',
		icon: <HiOutlineCog />,
		roles: ['admin', 'sales', 'customer'],
	},
	{
		key: 'support',
		label: 'Help & Support',
		path: '/support',
		icon: <HiOutlineQuestionMarkCircle />,
		roles: ['admin', 'sales', 'customer'],
	}
]