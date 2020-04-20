select 
    bs.*,
    bsl1.name as name_ru,
    bsl2.name as name_en
from 
    Tbar_sugars bs
    left join Tbar_sugars_l10n bsl1 on bs.id=bsl1.fid_id and bsl1.l10n_id=1
    left join Tbar_sugars_l10n bsl2 on bs.id=bsl2.fid_id and bsl2.l10n_id=3;