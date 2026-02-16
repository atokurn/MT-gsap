// Translation Dictionary
const translations = {
    'ID': { // Indonesia
        title: 'Pembaruan Sistem',
        desc: 'Kami sedang melakukan implementasi mesin streaming v2.0. Performa akan meningkat 40%. Estimasi kembali: 2 jam.',
        btn: 'Gabung Saluran Telegram',
        footer: 'Lihat Status Teknis'
    },
    'CN': { // China (Simplified)
        title: '系统升级',
        desc: '我们目前正在部署 v2.0 流媒体引擎。性能将提高 40%。预计恢复时间：2 小时。',
        btn: '加入 Telegram 频道',
        footer: '查看技术状态'
    },
    'TW': { // Taiwan (Traditional)
        title: '系統升級',
        desc: '我們目前正在部署 v2.0 串流引擎。效能將提升 40%。預計恢復時間：2 小時。',
        btn: '加入 Telegram 頻道',
        footer: '查看技術狀態'
    },
    'HK': { // Hong Kong (Traditional)
        title: '系統升級',
        desc: '我們目前正在部署 v2.0 串流引擎。效能將提升 40%。預計恢復時間：2 小時。',
        btn: '加入 Telegram 頻道',
        footer: '查看技術狀態'
    },
    'JP': { // Japan
        title: 'システムアップグレード',
        desc: '現在、v2.0ストリーミングエンジンをデプロイしています。パフォーマンスが40%向上します。復旧予定：2時間。',
        btn: 'Telegramチャンネルに参加',
        footer: '技術ステータスを表示'
    },
    'KR': { // Korea
        title: '시스템 업그레이드',
        desc: '현재 v2.0 스트리밍 엔진을 배포 중입니다. 성능이 40% 향상될 예정입니다. 예상 복구 시간: 2시간.',
        btn: '텔레그램 채널 참여',
        footer: '기술 상태 보기'
    },
    'TH': { // Thailand
        title: 'การอัปเกรดระบบ',
        desc: 'เรากำลังดำเนินการติดตั้งระบบสตรีมมิ่ง v2.0 ประสิทธิภาพจะดีขึ้น 40% คาดว่าจะกลับมาใช้งานได้ใน: 2 ชั่วโมง',
        btn: 'เข้าร่วมช่อง Telegram',
        footer: 'ดูสถานะทางเทคนิค'
    },
    'VN': { // Vietnam
        title: 'Nâng cấp hệ thống',
        desc: 'Chúng tôi đang triển khai công cụ phát trực tuyến v2.0. Hiệu suất sẽ được cải thiện 40%. Thời gian dự kiến: 2 giờ.',
        btn: 'Tham gia kênh Telegram',
        footer: 'Xem trạng thái kỹ thuật'
    },
    'ES': { // Spain (and Latin America mapping below)
        title: 'Actualización del sistema',
        desc: 'Actualmente estamos implementando el motor de transmisión v2.0. El rendimiento mejorará en un 40%. Retorno estimado: 2 horas.',
        btn: 'Unirse al canal de Telegram',
        footer: 'Ver estado técnico'
    },
    'PT': { // Portugal
        title: 'Atualização do sistema',
        desc: 'Estamos implantando o mecanismo de streaming v2.0. O desempenho melhorará em 40%. Retorno estimado: 2 horas.',
        btn: 'Entrar no canal do Telegram',
        footer: 'Ver status técnico'
    },
    'BR': { // Brazil (Portuguese)
        title: 'Atualização do sistema',
        desc: 'Estamos implantando o mecanismo de streaming v2.0. O desempenho melhorará em 40%. Retorno estimado: 2 horas.',
        btn: 'Entrar no canal do Telegram',
        footer: 'Ver status técnico'
    },
    'FR': { // France
        title: 'Mise à niveau du système',
        desc: 'Nous déployons actuellement le moteur de streaming v2.0. Les performances seront améliorées de 40 %. Retour estimé : 2 heures.',
        btn: 'Rejoindre la chaîne Telegram',
        footer: 'Voir l\'état technique'
    },
    'DE': { // Germany
        title: 'System-Upgrade',
        desc: 'Wir stellen derzeit die Streaming-Engine v2.0 bereit. Die Leistung wird um 40 % verbessert. Geschätzte Dauer: 2 Stunden.',
        btn: 'Telegram-Kanal beitreten',
        footer: 'Technischen Status anzeigen'
    },
    'IT': { // Italy
        title: 'Aggiornamento del sistema',
        desc: 'Stiamo implementando il motore di streaming v2.0. Le prestazioni miglioreranno del 40%. Ritorno stimato: 2 ore.',
        btn: 'Unisciti al canale Telegram',
        footer: 'Visualizza stato tecnico'
    },
    'PL': { // Poland
        title: 'Aktualizacja systemu',
        desc: 'Obecnie wdrażamy silnik strumieniowania v2.0. Wydajność poprawi się o 40%. Szacowany powrót: 2 godziny.',
        btn: 'Dołącz do kanału Telegram',
        footer: 'Zobacz status techniczny'
    }
};

// Country Mapping for broader coverage
const languageMap = {
    'MX': 'ES', 'AR': 'ES', 'CO': 'ES', 'CL': 'ES', 'PE': 'ES', // Spanish speaking
    'AT': 'DE', 'CH': 'DE', // German speaking
    'BE': 'FR', // French speaking (partially)
};

/**
 * Localizes the HTML content based on the user's country code.
 * @param {string} htmlString - The original HTML string (English).
 * @param {string} countryCode - The 2-letter country code from Cloudflare.
 * @returns {string} - The localized HTML string.
 */
export function localize(htmlString, countryCode) {
    if (!countryCode) return htmlString;
    countryCode = countryCode.toUpperCase();

    let targetLangCode = countryCode;
    if (languageMap[countryCode]) {
        targetLangCode = languageMap[countryCode];
    }

    const translation = translations[targetLangCode];

    if (translation) {
        return htmlString
            .replace('System Upgrade', translation.title)
            .replace(
                /We are currently deploying the v2\.0 streaming engine\. Performance will be improved by 40%\.\s+Estimated\s+return: 2 hours\./,
                translation.desc
            )
            .replace('Join Telegram Channel', translation.btn)
            .replace('View Technical Status', translation.footer);
    }

    return htmlString;
}
