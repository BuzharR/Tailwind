import { useEffect } from 'react';

function DebugProbe() {
    useEffect(() => {
        // #region agent log
        const log = (message, data, hypothesisId) => {
            const payload = JSON.stringify({
                sessionId: '83596e',
                location: 'DebugProbe.jsx',
                message,
                data,
                hypothesisId,
                timestamp: Date.now(),
                runId: 'initial',
            });
            fetch('/__debug/log', { method: 'POST', body: payload }).catch(() => {});
            fetch('http://127.0.0.1:7900/ingest/93da8fb1-b228-4820-ae9e-45c0fcc6adea', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '83596e' },
                body: payload,
            }).catch(() => {});
        };
        // #endregion

        const rootStyles = getComputedStyle(document.documentElement);
        // #region agent log
        log('theme-css-vars', {
            colorBtnPrimary: rootStyles.getPropertyValue('--color-btn-primary').trim(),
            colorActionPrimary: rootStyles.getPropertyValue('--color-action-primary').trim(),
            colorPurple500: rootStyles.getPropertyValue('--color-purple-500').trim(),
            colorBtnSecondary: rootStyles.getPropertyValue('--color-btn-secondary').trim(),
        }, 'C');
        // #endregion

        const buttons = [...document.querySelectorAll('button')];
        // #region agent log
        log('buttons-in-dom', { count: buttons.length }, 'E');
        // #endregion

        buttons.forEach((btn, index) => {
            const cs = getComputedStyle(btn);
            const card = btn.closest('.bg-card');
            const cardWidth = card ? parseFloat(getComputedStyle(card).width) : null;
            const btnWidth = parseFloat(cs.width);
            const bg = cs.backgroundColor;
            const isTransparent =
                bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent' || bg === '';

            // #region agent log
            log(`button-${index}-computed`, {
                label: btn.textContent?.trim(),
                className: btn.className,
                variantPrimary: btn.className.includes('bg-btn-primary'),
                variantSecondary: btn.className.includes('bg-btn-secondary'),
                hasWFull: btn.className.includes('w-full'),
                backgroundColor: bg,
                color: cs.color,
                widthPx: btnWidth,
                cardWidthPx: cardWidth,
                widthIsFull: cardWidth ? Math.abs(btnWidth - cardWidth) < 2 : null,
                isBackgroundTransparent: isTransparent,
            }, index === buttons.length - 1 ? 'A' : 'B');
            // #endregion
        });

        let bgBtnPrimaryRule = null;
        let bgBtnSecondaryRule = null;
        for (const sheet of document.styleSheets) {
            try {
                for (const rule of sheet.cssRules || []) {
                    if (rule.selectorText?.includes('.bg-btn-primary')) {
                        bgBtnPrimaryRule = rule.cssText;
                    }
                    if (rule.selectorText?.includes('.bg-btn-secondary')) {
                        bgBtnSecondaryRule = rule.cssText;
                    }
                }
            } catch {
                // cross-origin stylesheets may block cssRules access
            }
        }

        // #region agent log
        log('tailwind-css-rules', {
            bgBtnPrimaryRule,
            bgBtnSecondaryRule,
            stylesheetsScanned: document.styleSheets.length,
        }, 'E');
        // #endregion
    }, []);

    return null;
}

export default DebugProbe;
