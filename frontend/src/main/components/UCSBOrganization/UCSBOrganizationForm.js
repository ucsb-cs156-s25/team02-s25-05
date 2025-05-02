import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function UCSBOrganizationForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {} }
    );
    // Stryker restore all

    const navigate = useNavigate();
    const testIdPrefix = "UCSBOrganizationForm";

    return (
        <Form onSubmit={handleSubmit(submitAction)}>

            {/* orgCode is the primary key. Editable on create, read-only on update. */}
            <Form.Group className="mb-3" >
                <Form.Label htmlFor="orgCode">Organization Code</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-orgCode"}
                    id="orgCode"
                    type="text"
                    disabled={initialContents ? true : false}
                    isInvalid={Boolean(errors.orgCode)}
                    {...register("orgCode", {
                        required: "Organization Code is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.orgCode?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="orgTranslationShort">Short Organization Translation</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-orgTranslationShort"}
                    id="orgTranslationShort"
                    type="text"
                    isInvalid={Boolean(errors.orgTranslationShort)}
                    // Register with ONLY required validation
                    {...register("orgTranslationShort", {
                        required: "Short Organization Translation is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.orgTranslationShort?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="orgTranslation">Organization Translation</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-orgTranslation"}
                    id="orgTranslation"
                    type="text"
                    isInvalid={Boolean(errors.orgTranslation)}
                     // Register with ONLY required validation
                    {...register("orgTranslation", {
                        required: "Organization Translation is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.orgTranslation?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Check
                    type="checkbox"
                    label="Inactive"
                    id="inactive"
                    data-testid={testIdPrefix + "-inactive"}
                    {...register("inactive")}
                />
            </Form.Group>

            <Button
                type="submit"
                data-testid={testIdPrefix + "-submit"}
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={testIdPrefix + "-cancel"}
            >
                Cancel
            </Button>

        </Form>
    )
}

export default UCSBOrganizationForm;