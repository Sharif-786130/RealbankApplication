
import React from 'react'
import { Outlet } from 'react-router-dom'
import RoleLayout from './RoleLayout'

export default function CustomerLayout() {
  const customerMenuItems=[
      { label: "Dashboard", path: "dashboard" },
      // { label: "Profile", path: "profile" }
  ]
  return (
    // <div>
    //   <h2>Customer Layout</h2>
    //   <Outlet/>
    // </div>

    <RoleLayout
      menuItems={customerMenuItems}
      title="Customer Dashboard"
    />
  )
}


 