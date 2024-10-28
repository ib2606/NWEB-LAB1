import QRCode from 'qrcode';

export const generateQRCode = async (text: string): Promise<Buffer> => {
    try {
        return await QRCode.toBuffer(text);
    } catch (error) {
        throw new Error('Greška pri generiranju QR koda');
    }
};
