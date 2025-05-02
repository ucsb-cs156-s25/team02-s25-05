import React from "react";
import { useBackend } from "main/utils/useBackend";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBDiningCommonsMenuItemTable from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemTable";
import { useCurrentUser, hasRole } from "main/utils/currentUser";
import { Button } from "react-bootstrap";

export default function UCSBDiningCommonsMenuItemIndexPage() {
  const currentUser = useCurrentUser();

  const {
    data: menuItems,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/ucsbdiningcommonsmenuitem/all"],
    { method: "GET", url: "/api/ucsbdiningcommonsmenuitem/all" },
    // Stryker disable next-line all : don't test default value of empty list
    [],
  );

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
      return (
        <Button
          variant="primary"
          href="/ucsbdiningcommonsmenuitem/create"
          style={{ float: "right" }}
        >
          Create Menu Item
        </Button>
      );
    }
  };

  return (
    <BasicLayout>
      <div className="pt-2">
        {createButton()}
        <h1>Menu Items</h1>
        <UCSBDiningCommonsMenuItemTable menuItems={menuItems} currentUser={currentUser} />
      </div>
    </BasicLayout>
  );
}



// export default function UCSBDiningCommonsMenuItemIndexPage() {
//   // Stryker disable all : placeholder for future implementation
//   return (
//     <BasicLayout>
//       <div className="pt-2">
//         <h1>Index page not yet implemented</h1>
//         <p>
//           <a href="/diningcommonsmenuitem/create">Create</a>
//         </p>
//         <p>
//           <a href="/diningcommonsmenuitem/edit/1">Edit</a>
//         </p>
//       </div>
//     </BasicLayout>
//   );
// }
