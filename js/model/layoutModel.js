// 动态布局类
export class SKLayout {
    static contentShow(sectionDoc,contentDoc,skillInfoDoc,asideDoc,type) {
        switch (type) {
            case 'skill':
                asideDoc.classList.toggle('display-none', false);
                skillInfoDoc.classList.toggle('display-none', false);
                contentDoc.classList.toggle('display-none', true);
                if (window.innerWidth < 650) {
                    sectionDoc.classList.toggle('display-none', true);
                } else {
                    sectionDoc.classList.toggle('display-none', false);
                }
                break;
            case 'menu':
                asideDoc.classList.toggle('display-none', false);
                skillInfoDoc.classList.toggle('display-none', true);
                contentDoc.classList.toggle('display-none', false);
                if (window.innerWidth < 650) {
                    sectionDoc.classList.toggle('display-none', true);
                } else {
                    sectionDoc.classList.toggle('display-none', false);
                }
                break;
            default:
                if (window.innerWidth < 650) {
                    sectionDoc.classList.toggle('display-none', false);
                    asideDoc.classList.toggle('display-none', true);
                } else {
                    asideDoc.classList.toggle('display-none', false);
                    skillInfoDoc.classList.toggle('display-none', true);
                    contentDoc.classList.toggle('display-none', false);
                }
        }
    }

    static switchTag(contentDivDoc,liTagDocs,tagId) {
        switch (tagId) {
            case 'log':
                contentDivDoc[1].classList.toggle('display-none', false);
                contentDivDoc[2].classList.toggle('display-none', true);
                contentDivDoc[3].classList.toggle('display-none', true);
                liTagDocs[0].classList.toggle('background-tag', true);
                liTagDocs[1].classList.toggle('background-tag', false);
                liTagDocs[2].classList.toggle('background-tag', false);
                break;
            case 'statistics':
                contentDivDoc[1].classList.toggle('display-none', true);
                contentDivDoc[2].classList.toggle('display-none', false);
                contentDivDoc[3].classList.toggle('display-none', true);
                liTagDocs[1].classList.toggle('background-tag', true);
                liTagDocs[0].classList.toggle('background-tag', false);
                liTagDocs[2].classList.toggle('background-tag', false);
                break;
            case 'instruction':
                contentDivDoc[1].classList.toggle('display-none', true);
                contentDivDoc[2].classList.toggle('display-none', true);
                contentDivDoc[3].classList.toggle('display-none', false);
                liTagDocs[2].classList.toggle('background-tag', true);
                liTagDocs[1].classList.toggle('background-tag', false);
                liTagDocs[0].classList.toggle('background-tag', false);
                break;
            default:
                break;
        }
    }
}
