import {io} from '../../../libs/common/socket/socket'

/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({request}) => {
        const data = await request.formData();
        io.on('ack:prejoin', (data) => {
            console.log(data);
        });

        io.emit('prejoin', data.get('code'));
    }
}