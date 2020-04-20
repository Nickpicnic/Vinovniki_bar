select 
    bi.*,
    bil1.name as name_ru,
    bil2.name as name_en,
    '/f'||ffile_path(f.file_folder_id)||f.id||'.'||f.ext as image_url
from
    Tbar_menu_items bi
    left join Tbar_menu_items_l10n bil1 on bi.id=bil1.fid_id and bil1.l10n_id=1
    left join Tbar_menu_items_l10n bil2 on bi.id=bil2.fid_id and bil2.l10n_id=3
    left join Tfiles f on bi.image_id=f.id
