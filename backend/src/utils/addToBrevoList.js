import Brevo from 'sib-api-v3-sdk'
import dotenv from 'dotenv';
dotenv.config();

const defaultClient = Brevo.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const contactsApi = new Brevo.ContactsApi();

async function addToBrevoList(email, firstName) {
    const createContact = new Brevo.CreateContact();
    createContact.email = email;
    createContact.attributes = { FIRSTNAME: firstName };
    createContact.listIds = [10];

    try {
        const response = await contactsApi.createContact(createContact);
    } catch (error) {
        const brevoError = error.response?.body || error.message;
        throw new Error(`Error while adding email`);
    }
}

export default addToBrevoList;