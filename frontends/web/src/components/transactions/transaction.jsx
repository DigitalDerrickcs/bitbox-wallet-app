import { Component } from 'preact';
import { translate } from 'react-i18next';
import style from './transaction.css';
import IN from './assets/icon-transfer-in.svg';
import OUT from './assets/icon-transfer-out.svg';
// TODO: import SELF from './assets/icon-transfer-self.svg';

const transferIconMap = {
    receive: IN,
    send_to_self: IN,
    send: OUT
};

@translate()
export default class Transaction extends Component {
    state = {
        collapsed: true,
    }

    onUncollapse = e => {
        this.setState(({ collapsed }) => ({ collapsed: !collapsed }));
    }

    parseTime = time => {
        let arr;
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dt = new Date(Date.parse(time));
        return `${days[dt.getDay()]} ${dt.getDate()} ${months[dt.getMonth()]} ${dt.getFullYear()} - ${dt.getHours()}:${(dt.getMinutes() < 10 ? '0' : '') + dt.getMinutes()}`;
    }

    render({
        t,
        explorerURL,
        type,
        id,
        amount,
        fiat = '',
        fiat_historical = '',
        fee,
        numConfirmations,
        time,
        addresses,
    }, {
        collapsed,
    }) {
        const badge = t(`transaction.badge.${type}`);
        const sign = ((type === 'send') && '−') || ((type === 'receive') && '+') || null;
        // TODO: check if 'Time not yet available' is needed
        const date = time ? this.parseTime(time) : (numConfirmations <= 0 ? t('transaction.pending') : 'Time not yet available');
        return (
            <div class={[style.transactionContainer, collapsed ? style.collapsed : style.expanded].join(' ')}>
                <div class={['flex', 'flex-row', 'flex-start', 'flex-items-start', style.transaction].join(' ')}>
                    {/*
                    <div>
                        <img src={transferIconMap[type]} height="22" style="margin-right: var(--spacing-default)" />
                    </div>
                    */}
                    <div class="flex-1">
                        <div class={['flex', 'flex-row', 'flex-between', 'flex-items-start', style.row].join(' ')}>
                            <div class="flex flex-row flex-start flex-items-center">
                                <div class={[style.transactionLabel, style[type], style.flat].join(' ')}>
                                    {badge}
                                </div>
                                <div class={style.address}>{addresses}</div>
                            </div>
                            <div class={[style.amount, style[type]].join(' ')}>
                                {sign} {amount}
                            </div>
                        </div>
                        <div class={['flex', 'flex-row', 'flex-between', 'flex-items-start', style.row].join(' ')}>
                            <div class={style.date}>{date}</div>
                            <div class={[style.amount, style.converted].join(' ')}>{fiat}</div>
                        </div>

                        <div hidden={collapsed ? 'hidden' : null} class={style.collapsedContent}>
                            <div class={['flex', 'flex-row', 'flex-start', 'flex-items-start', style.row].join(' ')}>
                                <div>
                                    <div class={style.transactionLabel}>{t('transaction.confirmation')}</div>
                                    <div class={style.address}>{numConfirmations}</div>
                                </div>
                                {
                                    fee && (
                                        <div>
                                            <div class={style.transactionLabel}>{t('transaction.fee')}</div>
                                            <div class={style.address}>{fee}</div>
                                        </div>
                                    )
                                }
                                {
                                    fiat_historical && (
                                        <div style="align-self: flex-end; margin-left: auto; text-align: right;">
                                            <div class={style.transactionLabel} style="margin-right: 0;">
                                              {t('transaction.fiatHistorical')}
                                            </div>
                                            <div class={style.address}>{fiat_historical}</div>
                                        </div>
                                    )
                                }
                            </div>
                            <div class={style.row}>
                                <div class={style.transactionLabel}>{t('transaction.explorer')}</div>
                                <div class={style.address}>
                                    <a href={ explorerURL + id } target="_blank">{id}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class={style.toggleButton} onClick={this.onUncollapse}>
                    {collapsed ? "Expand" : "Collapse"}
                </div>
            </div>
        );
    }
}
