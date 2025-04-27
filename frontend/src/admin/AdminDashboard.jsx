import React from "react";
import { Link } from "react-router-dom";
import { SiCoffeescript } from "react-icons/si";
import { GiDonut } from "react-icons/gi";
import { FaConciergeBell } from "react-icons/fa";
import { BsBasket3Fill } from "react-icons/bs";
import { VscGraph } from "react-icons/vsc";
import { FaCoins } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import { BiSolidMessageSquareDetail } from "react-icons/bi";
import { FaEnvelope } from "react-icons/fa";
import { MdOutlinePayments } from "react-icons/md";
import { FaClockRotateLeft } from "react-icons/fa6";
import { MdOutlineInventory } from "react-icons/md";
import { PiTreasureChestBold } from "react-icons/pi";


const AdminDashboard = () => {
  const handleLogout = () => {
    // Clear any stored authentication data (e.g., token, user info)
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    window.location.href = "/"; // Redirect to the home page or login page
  };

  return (
    <div className="bg-zinc-300 min-h-screen text-white p-8 font-serif relative">
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute text-3xl top-7 right-10 bg-zinc-800 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg shadow-md transition duration-200 font-semibold cursor-pointer"
      >
        <IoLogOutOutline />
      </button>

      <h1 className="text-center text-black tracking-widest text-4xl font-bold mb-12">
        HypeBeans Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Manage Products */}
        <Link
          to="/admin/manage-products"
          className="bg-zinc-800 p-8 rounded-xl shadow-md hover:bg-zinc-600 transition text-center"
        >
          <h2 className="text-2xl font-semibold mb-4">Manage Products</h2>
          <div className="flex justify-center gap-7">
            <SiCoffeescript className="text-7xl" />
            <GiDonut className="text-7xl" />
          </div>
          <p className="mt-7 mx-auto tracking-widest text-xl w-[70%]">
            View, add, edit, and delete products. Monitor low-stock items.
          </p>
        </Link>

        {/* Manage Orders */}
        <Link
          to="/admin/manage-orders"
          className="bg-zinc-800 p-8 rounded-xl shadow-md hover:bg-zinc-600 transition text-center"
        >
          <h2 className="text-2xl font-semibold mb-4">Manage Orders</h2>
          <div className="flex justify-center gap-7">
            <BsBasket3Fill className="text-7xl" />
            <FaConciergeBell className="text-7xl" />
          </div>
          <p className="mt-7 mx-auto tracking-widest text-xl w-[70%]">
            View all orders, update their status, and track delivery locations.
          </p>
        </Link>

        {/* Sales Analytics */}
        <Link
          to="/admin/sales-analytics"
          className="bg-zinc-800 p-8 rounded-xl shadow-md hover:bg-zinc-600 transition text-center"
        >
          <h2 className="text-2xl font-semibold mb-4">Sales Analytics</h2>
          <div className="flex justify-center gap-7">
            <FaCoins className="text-7xl" />
            <VscGraph className="text-7xl" />
          </div>
          <p className="mt-7 mx-auto tracking-widest text-xl w-[70%]">
            Analyze monthly revenue trends and overall sales performance.
          </p>
        </Link>

        {/* User Management */}
        <Link
          to="/admin/user-management"
          className="bg-zinc-800 p-8 rounded-xl shadow-md hover:bg-zinc-600 transition text-center"
        >
          <h2 className="text-2xl font-semibold mb-4">User Management</h2>
          <div className="flex justify-center gap-7">
            <MdManageAccounts className="text-8xl" />
          </div>
          <p className="mt-7 mx-auto tracking-widest text-xl w-[70%]">
            View all registered users and their account details.
          </p>
        </Link>

        {/* Manage Messages */}
        <Link
          to="/admin/messages"
          className="bg-zinc-800 p-8 rounded-xl shadow-md hover:bg-zinc-600 transition text-center"
        >
          <h2 className="text-2xl font-semibold mb-4">Messages</h2>
          <div className="flex justify-center gap-7">
            <BiSolidMessageSquareDetail className="text-8xl" />
            <FaEnvelope className="text-8xl" />
          </div>
          <p className="mt-7 mx-auto tracking-widest text-xl w-[70%]">
            View all user messages sent via the contact page.
          </p>
        </Link>

        {/* Online Payment Records */}
        <Link
          to="/admin/payment-records"
          className="bg-zinc-800 p-8 rounded-xl shadow-md hover:bg-zinc-600 transition text-center"
        >
          <h2 className="text-2xl font-semibold mb-4">Payment Records</h2>
          <div className="flex justify-center gap-7">
            <MdOutlinePayments className="text-8xl" />
            <FaClockRotateLeft className="text-8xl" />
          </div>
          <p className="mt-7 mx-auto tracking-widest text-xl w-[70%]">
            View all the proof and records of online payment.
          </p>
        </Link>

        {/* Inventory */}
        <Link
          to="/admin/inventory"
          className="bg-zinc-800 p-8 rounded-xl shadow-md hover:bg-zinc-600 transition text-center"
        >
          <h2 className="text-2xl font-semibold mb-4">Inventory</h2>
          <div className="flex justify-center gap-7">
            <MdOutlineInventory className="text-8xl" />
            <PiTreasureChestBold className="text-8xl" />
          </div>
          <p className="mt-7 mx-auto tracking-widest text-xl w-[70%]">
            View the stock level of the products.
          </p>
        </Link>

      </div>
    </div>
  );
};

export default AdminDashboard;