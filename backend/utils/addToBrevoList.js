const Brevo = require('sib-api-v3-sdk');

const defaultClient = Brevo.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const contactsApi = new Brevo.ContactsApi();

async function addToBrevoList(email, firstName) {
    const createContact = new Brevo.CreateContact();
    createContact.email = email;
    createContact.attributes = { FIRSTNAME: firstName };
    createContact.listIds = [10]; // ✅ Use your Brevo list ID

    try {
        const response = await contactsApi.createContact(createContact);
        return { success: true, message: 'Email added to wait list successfully. We will send you an email when you have been added to the access list', data: response };
    } catch (error) {
        const brevoError = error.response?.body || error.message;

        // If Brevo says the contact already exists → throw an explicit error
        if (error.response?.body?.code === 'duplicate_parameter') {
            throw new Error(`Your email already exist in the wait list. We will send you an email when you have been added to the access list`);
        }

        // For other errors → propagate them
        throw new Error(`Error while adding email`);
    }
}

module.exports = addToBrevoList;
