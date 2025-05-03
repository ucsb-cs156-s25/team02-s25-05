import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams, Navigate } from "react-router-dom";
import UCSBOrganizationForm from "main/components/UCSBOrganizations/UCSBOrganizationForm";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBOrganizationEditPage({ storybook = false }) {
    const { orgCode } = useParams();

  const {
    data: organization,
    _error,
    _status,
  } = useBackend(
    [`/api/ucsborganizations?orgCode=${orgCode}`],          // query key
    {
      method: "GET",
      url: "/api/ucsborganizations",
      params: { orgCode },
    }
  );


  const objectToAxiosPutParams = (org) => ({
    url: "/api/ucsborganizations",
    method: "PUT",
    params: { orgCode: org.orgCode },
    data: {
      orgTranslationShort: org.orgTranslationShort,
      orgTranslation: org.orgTranslation,
      inactive: org.inactive,
    },
  });

  const onSuccess = (org) => {
    toast(
      `UCSB Organization Updated - orgCode: ${org.orgCode} short: ${org.orgTranslationShort}`
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    [`/api/ucsborganizations?orgCode=${orgCode}`]           // re‑fetch this row
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };


  if (isSuccess && !storybook) {
    return <Navigate to="/ucsborganizations" />;
  }


  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit UCSB Organization</h1>
        {organization && (
          <UCSBOrganizationForm
            submitAction={onSubmit}
            buttonLabel={"Update"}
            initialContents={organization}
          />
        )}
      </div>
    </BasicLayout>
  );
}
