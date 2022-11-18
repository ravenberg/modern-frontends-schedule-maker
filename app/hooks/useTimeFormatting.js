export default function(talksByTime) {

    if (typeof talksByTime !== 'undefined') {
        //{
        //   'Thu 09:15 - 09:30': [
        //      { ...talkdata },
        //      { ...talkdata },
        //    ],
        //   'Thu 10:00 - 10:45: [
        //      { ...talkdata },
        //      { ...talkdata },
        //    ],
        //    etc...
        //}

        Object.keys(talksByTime).forEach(key => {
            talksByTime[key].forEach((talk) => {
                const time = talk.time.replaceAll(' ', '');
                const day = time.slice(0, 3);
                const [startTime, endTime] = talk.time.split('-');

                talk.startDate = new Date(`${day === 'Thu' ? '17' : '18'} November 2022 ${startTime}`);
                talk.endDate = new Date(`${day === 'Thu' ? '17' : '18'} November 2022 ${endTime}`);
            })
        })
    }

    const isTalkDone = function(talk) {
        const now = new Date();

        return now > talk.endDate;
    }

    return {
        isTalkDone
    }
}
