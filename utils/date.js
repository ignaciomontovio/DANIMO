exports.isAdult = ({ date }) => {
    console.log(date)
    if (!date) return false;

    const birthDate = new Date(date);
    const today = new Date();

    const age = today.getFullYear() - birthDate.getFullYear();
    console.log(age)
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    const dayDiff = today.getDate() - birthDate.getDate();
    
    if (
        age > 18 ||
        (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)))
    ) {
        return true;
    }

    return false;
};
