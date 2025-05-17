export async function createDailyRegister(date, email) {
    const userId = await (findUserIdByEmail(email))
    if (!userId) {
        return res.status(400).json({error: 'No puedo cargar registro diario. Usuario no existe.'});
    }

    await DailyRegisters.create({
        id: `U-${uuidv4()}`,
        date: date,
        userId: userId
    });
}

const findUserIdByEmail = async (email) => {
    const user = await Users.findOne({
        where: { email },
        attributes: ['id']
    });
    return user?.id || null;
};