select 
    bc.*,
    bcl1.name as name_ru,
    bcl2.name as name_en
from 
    Tbar_wine_colors bc
    left join Tbar_wine_colors_l10n bcl1 on bc.id=bcl1.fid_id and bcl1.l10n_id=1
    left join Tbar_wine_colors_l10n bcl2 on bc.id=bcl2.fid_id and bcl2.l10n_id=3;
