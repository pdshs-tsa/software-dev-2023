import { redirect } from "@sveltejs/kit";
import database from "../../../database.js";

export const actions = {
  default: async ({cookies, request}) => {
    const formData = await request.formData();
    const username = await formData.get('username');
    const password = await formData.get('password');

    console.log(await database.fetchSetTable());

    if (username !== 'charlieboalch' && password !== 'charlieboalch') return;
    await cookies.set('admin', Date.now());
    throw redirect(300, '/admin/auth');
  }
}