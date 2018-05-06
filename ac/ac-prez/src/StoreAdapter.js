
export default function(props) {
    console.log(props);
    const PDFJSAnnotate = require('pdf-annotate').default;

    const { data, dataFn, userInfo } = props;

    const StoreAdapter = new PDFJSAnnotate.StoreAdapter({
        getAnnotations(documentId, pageNumber) {
            return new Promise((resolve, reject) => {
                resolve({
                    documentId,
                    pageNumber,
                    data
                })
            })
        },
    
        getAnnotation(documentId, annotationId) {
            return null;
        },
    
        addAnnotation(documentId, pageNumber, annotation) {
            dataFn.listAppend({ documentId, pageNumber, annotation });
        },
    
        // editAnnotation(documentId, pageNumber, annotation) {/* ... */},
    
        // deleteAnnotation(documentId, annotationId) {/* ... */},
    
        // addComment(documentId, annotationId, content) {/* ... */},
    
        // deleteComment(documentId, commentId) {/* ... */}
    });

    return StoreAdapter;
}

